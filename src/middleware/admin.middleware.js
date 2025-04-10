import sequelize from "../config/database.js";

export const isAdmin = async (req, res, next) => {
    try {
        // Verificar sesión admin
        if (!req.session || !req.session.admin || !req.session.admin.admin_code) {
            return res.status(401).json({
                success: false,
                error: "Acceso no autorizado: Inicie sesión como administrador"
            });
        }

        // Verificar código admin en BD usando SQL puro
        const query = `
            SELECT * FROM admin WHERE admin_code = $1
        `;
        const [results] = await sequelize.query(query, {
            bind: [req.session.admin.admin_code],
        });

        if (results.length === 0) {
            return res.status(403).json({
                success: false,
                error: "Credenciales de administrador inválidas"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const validateTable = async (req, res, next) => {
    let { table } = req.params;
    const forbiddenTables = ['admin', 'usuarios', 'sessions'];

    try {
        // Limpiar el nombre de la tabla eliminando caracteres no deseados
        table = table.replace(/[^a-zA-Z0-9_]/g, ""); // Permitir solo letras, números y guiones bajos
        console.log(`Validando tabla limpia: ${table}`); // Log para depuración

        if (!table) {
            return res.status(400).json({
                success: false,
                error: "Nombre de tabla inválido"
            });
        }

        const query = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = $1
        `;
        console.log(`Consulta ejecutada: ${query}`); // Log para depuración
        const [results] = await sequelize.query(query, {
            bind: [table],
        });

        if (results.length === 0) {
            console.error(`Tabla '${table}' no existe en la base de datos`); // Log de error
            return res.status(404).json({
                success: false,
                error: `Tabla '${table}' no existe en la base de datos`
            });
        }

        // Bloquear acceso a tablas sensibles
        if (forbiddenTables.includes(table)) {
            console.error(`Acceso prohibido a la tabla '${table}'`); // Log de error
            return res.status(403).json({
                success: false,
                error: "Acceso prohibido a esta tabla"
            });
        }

        req.tableName = table; // Asignar el nombre de la tabla al request
        next();
    } catch (error) {
        console.error(`Error en validateTable: ${error.message}`); // Log de error
        next(error);
    }
};