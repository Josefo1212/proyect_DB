import sequelize from "../config/database.js";

export const createRecord = async (req, res) => {
    try {
        console.log(`Tabla recibida: ${req.tableName}`); // Log para depuración

        // 1. Validar nombre de tabla (seguridad adicional)
        if (!/^[a-z_]+$/.test(req.tableName)) {
            return res.status(400).json({
                success: false,
                error: "Nombre de tabla inválido"
            });
        }

        // 2. Obtener estructura de la tabla
        const tableInfo = await sequelize.queryInterface.describeTable(req.tableName);
        console.log(`Estructura de la tabla:`, tableInfo); // Log para depuración

        // 3. Filtrar columnas válidas
        const validColumns = Object.keys(tableInfo).filter(col => col !== 'id' && col !== 'createdAt' && col !== 'updatedAt');
        const payload = {};
        
        validColumns.forEach(col => {
            if (req.body[col] !== undefined) {
                payload[col] = req.body[col];
            }
        });

        // Validar que el payload no esté vacío
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron datos válidos para crear el registro"
            });
        }

        // 4. Construir consulta segura
        const columns = Object.keys(payload).join(", ");
        const placeholders = Object.keys(payload).map((_, i) => `$${i + 1}`).join(", ");
        
        const query = `
            INSERT INTO "${req.tableName}" 
            (${columns})
            VALUES (${placeholders})
            RETURNING *;
        `;

        console.log(`Consulta ejecutada: ${query}`); // Log para depuración

        // 5. Ejecutar consulta
        const [result] = await sequelize.query(query, {
            bind: Object.values(payload),
            type: sequelize.QueryTypes.INSERT
        });

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(`Error en createRecord: ${error.message}`); // Log de error
        res.status(400).json({
            success: false,
            error: `Error creando registro: ${error.message}`
        });
    }
};

export const getRecords = async (req, res) => {
    try {
        console.log(`Tabla recibida: ${req.tableName}`); // Log para depuración

        // Validar nombre de tabla
        if (!/^[a-z_]+$/.test(req.tableName)) {
            return res.status(400).json({
                success: false,
                error: "Nombre de tabla inválido"
            });
        }

        const query = `SELECT * FROM "${req.tableName}";`;
        console.log(`Consulta ejecutada: ${query}`); // Log para depuración
        const [results] = await sequelize.query(query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error(`Error en getRecords: ${error.message}`); // Log de error
        res.status(500).json({
            success: false,
            error: `Error obteniendo registros: ${error.message}`
        });
    }
};

export const updateRecord = async (req, res) => {
    try {
        console.log(`Tabla recibida: ${req.tableName}`); // Log para depuración
        console.log(`ID recibido: ${req.params.id}`); // Log para depuración

        // 1. Validar que el ID sea un número entero válido
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido: debe ser un número entero"
            });
        }

        // 2. Obtener estructura de la tabla
        const tableInfo = await sequelize.queryInterface.describeTable(req.tableName);
        const validColumns = Object.keys(tableInfo).filter(col => col !== 'id');

        // 3. Filtrar y validar campos del cuerpo de la solicitud
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (validColumns.includes(key)) {
                updates[key] = value;
            }
        }

        // Validar que haya al menos un campo para actualizar
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No se enviaron campos válidos para actualizar"
            });
        }

        // 4. Construir la cláusula SET de la consulta
        const setClause = Object.keys(updates)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(", ");

        const query = `
            UPDATE "${req.tableName}"
            SET ${setClause}
            WHERE id = $${Object.keys(updates).length + 1}
            RETURNING *
        `;

        console.log(`Consulta ejecutada: ${query}`); // Log para depuración

        // 5. Ejecutar la consulta con parámetros vinculados
        const params = [...Object.values(updates), id];
        const [result] = await sequelize.query(query, {
            bind: params,
            type: sequelize.QueryTypes.UPDATE
        });

        // 6. Verificar si se actualizó algún registro
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error(`Error en updateRecord: ${error.message}`); // Log de error
        res.status(500).json({
            success: false,
            error: `Error actualizando registro: ${error.message}`
        });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        // 1. Validar ID numérico
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido"
            });
        }

        // 2. Query parameterized
        const query = `
            DELETE FROM "${req.tableName}"
            WHERE id = $1
            RETURNING *
        `;

        // 3. Ejecutar con bind params
        const [result] = await sequelize.query(query, {
            bind: [id],
            type: sequelize.QueryTypes.DELETE
        });

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Registro no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error eliminando registro: ${error.message}`
        });
    }
};

export const profile = async (req, res) => {
    try {
        const { username: paramUsername } = req.params;

        // Verificar si es admin
        const isAdmin = req.session?.admin || false;

        // Caso 1: Admin buscando perfil de otro usuario
        if (isAdmin && paramUsername) {
            console.log(`Admin buscando usuario con username: ${paramUsername}`); // Debug log

            const query = `
                SELECT id, username, email, fecha_creacion 
                FROM usuario 
                WHERE username = $1
            `;
            
            const result = await sequelize.query(query, {
                bind: [paramUsername],
                type: sequelize.QueryTypes.SELECT
            });

            console.log(`Resultado de la consulta (admin):`, result); // Debug log
            
            if (!result || result.length === 0) {
                return res.status(404).json({
                    message: "Usuario no encontrado",
                    success: false
                });
            }

            return res.json({
                message: "Perfil obtenido (vista admin)",
                success: true,
                user: result[0]
            });
        }

        // Caso 2: Usuario normal viendo su propio perfil
        if (!req.session?.username) {
            return res.status(401).json({
                message: "No autorizado",
                success: false
            });
        }

        console.log(`Usuario normal buscando perfil con username: ${req.session.username}`); // Debug log

        const query = `
            SELECT id, username, email, fecha_creacion 
            FROM usuario 
            WHERE username = $1
        `;

        const result = await sequelize.query(query, {
            bind: [req.session.username],
            type: sequelize.QueryTypes.SELECT
        });

        console.log(`Resultado de la consulta (usuario normal):`, result); // Debug log

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                success: false
            });
        }

        res.json({
            message: "Perfil obtenido",
            success: true,
            user: result[0]
        });

    } catch (error) {
        console.error("Error en profile:", error);
        res.status(500).json({
            message: `Error interno: ${error.message}`,
            success: false
        });
    }
};