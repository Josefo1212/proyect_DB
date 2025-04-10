import sequelize from '../config/database.js';
import Cartas from '../models/carta.js';
import Coleccion from '../models/coleccion.js';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
dotenv.config();

// Mostrar las cartas de una colección. (consulta 1)
export const getCartasByColeccion = async (req, res) => {
    const { coleccionNombre } = req.query;

    try {
        if (!coleccionNombre) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'coleccionNombre' es obligatorio en la URL"
            });
        }

        const coleccion = await Coleccion.findOne({
            where: { nombre: coleccionNombre }
        });

        if (!coleccion) {
            return res.status(404).json({
                success: false,
                error: `No se encontró la colección con nombre ${coleccionNombre}`
            });
        }

        const cartas = await Cartas.findAll({ 
            where: { coleccion_id: coleccion.id },
            attributes: ['producto_id', 'nombre', 'rareza', 'dibujante_id', 'flavor_text', 'coleccion_id'] // Selecciona campos específicos
        });

        if (!cartas || cartas.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron cartas para la colección ${coleccionNombre}`
            });
        }

        res.status(200).json({
            success: true,
            data: cartas
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor"
        });
    }
};

// Obtener colecciones donde se puede hallar una carta(consulta 2)
export const getColeccionesByCarta = async (req, res) => {
    const { cartaNombre } = req.query; // Cambiar a nombre

    try {
        if (!cartaNombre) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'cartaNombre' es obligatorio en la URL"
            });
        }

        const carta = await Cartas.findOne({
            where: { nombre: cartaNombre },
            attributes: ['producto_id', 'nombre', 'rareza', 'dibujante_id', 'flavor_text', 'coleccion_id'], // Detalles de la carta
            include: [{
                model: Coleccion, 
                attributes: ['id', 'nombre', 'descripcion']
            }]
        });

        if (!carta) {
            return res.status(404).json({
                success: false,
                error: `No se encontró información para la carta con nombre ${cartaNombre}`
            });
        }

        res.status(200).json({
            success: true,
            data: carta
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor"
        });
    }
};

// Mostrar la cantidad de criaturas, instantáneos, encantamientos, conjuros y cualquier otra categoría de carta dentro de una colección(consulta 3)
export const getCardCategoriesByCollection = async (req, res) => {
    const { coleccionNombre } = req.query;

    try {
        if (!coleccionNombre) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'coleccionNombre' es obligatorio en la URL"
            });
        }

        const cardCategories = await sequelize.query(`
            SELECT 
                'Criatura' AS categoria, COUNT(criatura.carta_id) AS cantidad
            FROM criatura
            INNER JOIN cartas ON criatura.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Encantamiento' AS categoria, COUNT(encantamiento.carta_id) AS cantidad
            FROM encantamiento
            INNER JOIN cartas ON encantamiento.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Conjuro' AS categoria, COUNT(conjuro.carta_id) AS cantidad
            FROM conjuro
            INNER JOIN cartas ON conjuro.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Instantáneo' AS categoria, COUNT(instantaneo.carta_id) AS cantidad
            FROM instantaneo
            INNER JOIN cartas ON instantaneo.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Artefacto' AS categoria, COUNT(artefacto.carta_id) AS cantidad
            FROM artefacto
            INNER JOIN cartas ON artefacto.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Planeswalker' AS categoria, COUNT(planeswalker.carta_id) AS cantidad
            FROM planeswalker
            INNER JOIN cartas ON planeswalker.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Batalla' AS categoria, COUNT(batalla.carta_id) AS cantidad
            FROM batalla
            INNER JOIN cartas ON batalla.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
            UNION ALL
            SELECT 
                'Tierra' AS categoria, COUNT(tierra.carta_id) AS cantidad
            FROM tierra
            INNER JOIN cartas ON tierra.carta_id = cartas.producto_id
            INNER JOIN coleccion ON cartas.coleccion_id = coleccion.id
            WHERE coleccion.nombre = :coleccionNombre
        `, {
            replacements: { coleccionNombre },
            type: sequelize.QueryTypes.SELECT
        });

        if (!cardCategories || cardCategories.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron categorías de cartas para la colección ${coleccionNombre}`
            });
        }

        res.status(200).json({
            success: true,
            data: cardCategories
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor"
        });
    }
};

// Obtener cartas de un color específico impresas entre dos fechas, con opción de filtrar por multicolor(consulta 4)
export const getCartasByColorAndDate = async (req, res) => {
    const { color, fechaInicio, fechaFin, multicolor = 'all' } = req.query;

    try {
        const query = `
            SELECT 
                c.producto_id, 
                c.nombre, 
                c.fecha_impresion, 
                c.costo_mana,
                STRING_AGG(DISTINCT m.tipo, ', ') AS colores,
                cm.tipo_coste AS tipo
            FROM cartas c
            JOIN carta_mana cm ON c.producto_id = cm.carta_id
            JOIN mana m ON cm.mana_tipo = m.tipo
            WHERE
                (m.tipo = $1 OR m.tipo LIKE $2 OR m.tipo LIKE $3)
                AND c.fecha_impresion BETWEEN COALESCE($4::DATE, '1900-01-01') 
                AND COALESCE($5::DATE, CURRENT_DATE)
                AND (
                    $6 = 'all' OR
                    ($6 = 'true' AND cm.tipo_coste = 'multicolor') OR
                    ($6 = 'false' AND cm.tipo_coste != 'multicolor')
                )
            GROUP BY c.producto_id, cm.tipo_coste
            ORDER BY c.nombre;
        `;

        const colorArray = color.split('/').map(c => c.toLowerCase());
        const cartas = await sequelize.query(query, {
            bind: [
                colorArray[0], 
                `${colorArray[0]}/%`, 
                `%/${colorArray[0]}`, 
                fechaInicio || null, 
                fechaFin || null,
                multicolor
            ],
            type: sequelize.QueryTypes.SELECT
        });

        if (!cartas || cartas.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron cartas con los filtros especificados`
            });
        }

        res.status(200).json({
            success: true,
            data: cartas
        });

    } catch (error) {
        console.error('Error en getCartasByColorAndDate:', error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor al buscar cartas"
        });
    }
};

//consulta 5
export const getProductOffers = async (req, res) => {
    const { producto_id } = req.query;

    try {
        // Validar parámetro
        if (!producto_id || isNaN(producto_id)) {
            return res.status(400).json({
                success: false,
                error: "Se requiere un ID de producto válido"
            });
        }

        // Consulta SQL
        const query = `
            SELECT
                c.precio,
                u.username,
                u.email, -- Email only from usuario table
                CASE 
                    WHEN s.nombre_sucursal IS NOT NULL THEN 'Sucursal'
                    ELSE 'Persona'
                END AS tipo_vendedor,
                COALESCE(s.nombre_sucursal, CONCAT(p.nombre, ' ', p.apellido)) AS nombre_vendedor
            FROM comercio c
            JOIN usuario u ON c.vendedor_id = u.id
            LEFT JOIN persona p ON u.id = p.usuario_id
            LEFT JOIN sucursal s ON u.id = s.usuario_id
            WHERE 
                c.producto_id = :producto_id 
                AND c.estado = 1 -- Changed 'activa' to numeric value 1
            ORDER BY c.precio ASC;
        `;

        const ofertas = await sequelize.query(query, {
            replacements: { producto_id: parseInt(producto_id) },
            type: sequelize.QueryTypes.SELECT
        });

        // Obtener información básica del producto
        const producto = await sequelize.query(`
            SELECT id, descripcion, tipo_producto 
            FROM producto 
            WHERE id = :producto_id
        `, {
            replacements: { producto_id: parseInt(producto_id) },
            type: sequelize.QueryTypes.SELECT
        });

        if (!producto || producto.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado"
            });
        }

        // Respuesta estructurada
        const response = {
            producto: {
                id: producto[0].id,
                nombre: producto[0].descripcion,
                tipo: producto[0].tipo_producto
            },
            ofertas_disponibles: ofertas.map(oferta => ({
                precio: oferta.precio,
                vendedor: {
                    username: oferta.username,
                    nombre: oferta.nombre_vendedor,
                    tipo: oferta.tipo_vendedor,
                    contacto: {
                        email: oferta.email // Removed telefono
                    }
                }
            }))
        };

        res.status(200).json({ success: true, data: response });

    } catch (error) {
        console.error('Error en getProductOffers:', error);
        res.status(500).json({
            success: false,
            error: "Error al obtener las ofertas del producto"
        });
    }
};

//consulta 6
export const getUserTransactionHistory = async (req, res) => {
    const { username } = req.query;

    try {
        if (!username) {
            return res.status(400).json({
                success: false,
                error: "Se requiere el nombre de usuario (username)"
            });
        }

        const query = `
            SELECT
                p.descripcion AS producto,
                c.precio,
                CASE 
                    WHEN c.vendedor_id = u.id THEN 'Venta'
                    ELSE 'Compra'
                END AS tipo_transaccion,
                CASE
                    WHEN c.vendedor_id = u.id THEN 
                        CASE
                            WHEN comprador_s.usuario_id IS NOT NULL THEN comprador_s.nombre_sucursal
                            ELSE CONCAT(comprador_p.nombre, ' ', comprador_p.apellido)
                        END
                    ELSE
                        CASE
                            WHEN vendedor_s.usuario_id IS NOT NULL THEN vendedor_s.nombre_sucursal
                            ELSE CONCAT(vendedor_p.nombre, ' ', vendedor_p.apellido)
                        END
                END AS nombre_contraparte,
                CASE
                    WHEN c.vendedor_id = u.id THEN 
                        CASE
                            WHEN comprador_s.usuario_id IS NOT NULL THEN 'Sucursal'
                            ELSE 'Persona'
                        END
                    ELSE
                        CASE
                            WHEN vendedor_s.usuario_id IS NOT NULL THEN 'Sucursal'
                            ELSE 'Persona'
                        END
                END AS tipo_contraparte,
                COALESCE(
                    CASE
                        WHEN c.vendedor_id = u.id THEN comprador_u.email
                        ELSE vendedor_u.email
                    END, 
                    'No disponible'
                ) AS contacto
            FROM comercio c
            JOIN usuario u ON (c.vendedor_id = u.id OR c.comprador_id = u.id)
            JOIN producto p ON c.producto_id = p.id
            LEFT JOIN usuario comprador_u ON c.comprador_id = comprador_u.id
            LEFT JOIN persona comprador_p ON comprador_u.id = comprador_p.usuario_id
            LEFT JOIN sucursal comprador_s ON comprador_u.id = comprador_s.usuario_id
            LEFT JOIN usuario vendedor_u ON c.vendedor_id = vendedor_u.id
            LEFT JOIN persona vendedor_p ON vendedor_u.id = vendedor_p.usuario_id
            LEFT JOIN sucursal vendedor_s ON vendedor_u.id = vendedor_s.usuario_id
            WHERE u.username = :username
                AND c.estado = 1
            ORDER BY c.precio DESC; -- Removed c.fecha_transaccion
        `;

        const transacciones = await sequelize.query(query, {
            replacements: { username },
            type: sequelize.QueryTypes.SELECT
        });

        if (transacciones.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No se encontraron transacciones confirmadas"
            });
        }

        const response = transacciones.map(t => ({
            producto: t.producto,
            tipo: t.tipo_transaccion,
            monto: t.precio,
            contraparte: {
                nombre: t.nombre_contraparte || "Desconocido",
                tipo: t.tipo_contraparte,
                contacto: t.contacto
            }
        }));

        res.status(200).json({ success: true, data: response });

    } catch (error) {
        console.error('Error en getUserTransactionHistory:', error);
        res.status(500).json({
            success: false,
            error: "Error al obtener el historial"
        });
    }
};
// Mostrar ofertas de productos de un usuario y la información de ese usuario, agregar la cantidad de ventas/intercambios realizados con éxito(consulta 7
export const getUserOffersAndStats = async (req, res) => {
    const { username } = req.query;

    try {
        if (!username) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'username' es obligatorio"
            });
        }

        // Paso 1: Obtener información del usuario
        const usuario = await sequelize.query(`
            SELECT 
                u.id,
                u.username,
                u.email,
                u.fecha_creacion,
                p.nombre AS nombre_persona,
                p.apellido,
                s.nombre_sucursal
            FROM usuario u
            LEFT JOIN persona p ON u.id = p.usuario_id
            LEFT JOIN sucursal s ON u.id = s.usuario_id
            WHERE u.username = :username
        `, {
            replacements: { username },
            type: sequelize.QueryTypes.SELECT
        });

        if (!usuario || usuario.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Usuario '${username}' no encontrado`
            });
        }

        const usuarioData = usuario[0];
        const usuarioId = usuarioData.id;

        // Paso 2: Obtener ofertas del usuario
        const ofertas = await sequelize.query(`
            SELECT 
                c.producto_id,
                p.descripcion AS producto_nombre,
                c.precio,
                c.estado,
                CASE 
                    WHEN m.nombre IS NOT NULL THEN 'Mazo'
                    WHEN s.nombre_coleccion IS NOT NULL THEN 'Sobre'
                    ELSE 'Carta'
                END AS tipo_producto
            FROM comercio c
            JOIN producto p ON c.producto_id = p.id
            LEFT JOIN mazo_derivado m ON p.id = m.producto_id
            LEFT JOIN sobre_derivado s ON p.id = s.producto_id
            WHERE c.vendedor_id = :usuarioId
        `, {
            replacements: { usuarioId },
            type: sequelize.QueryTypes.SELECT
        });

        // Paso 3: Contar ventas e intercambios exitosos (estado = 1)
        const estadisticas = await sequelize.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN c.precio > 0 AND c.estado = 1 THEN 1 ELSE 0 END), 0) AS ventas,
                COALESCE(SUM(CASE WHEN c.precio = 0 AND c.estado = 1 THEN 1 ELSE 0 END), 0) AS intercambios
            FROM comercio c
            WHERE c.vendedor_id = :usuarioId
        `, {
            replacements: { usuarioId },
            type: sequelize.QueryTypes.SELECT
        });

        const ventas = estadisticas[0].ventas ? parseInt(estadisticas[0].ventas, 10) : 0;
        const intercambios = estadisticas[0].intercambios ? parseInt(estadisticas[0].intercambios, 10) : 0;

        // Formatear respuesta
        const response = {
            usuario: {
                id: usuarioData.id,
                username: usuarioData.username,
                email: usuarioData.email,
                tipo: usuarioData.nombre_sucursal ? 'Sucursal' : 'Persona',
                nombre: usuarioData.nombre_sucursal 
                    ? usuarioData.nombre_sucursal 
                    : `${usuarioData.nombre_persona} ${usuarioData.apellido}`
            },
            ofertas: ofertas,
            transacciones_exitosas: {
                ventas: ventas,
                intercambios: intercambios,
                total: ventas + intercambios
            }
        };

        res.status(200).json({ success: true, data: response });

    } catch (error) {
        console.error('Error en getUserOffersAndStats:', error);
        res.status(500).json({
            success: false,
            error: "Error interno al procesar la solicitud"
        });
    }
};
// Obtener información sobre el mazo de un jugador(consulta 8)
export const getMazoInfoByJugador = async (req, res) => {
    const { username, mazoNombre } = req.query;

    try {
        if (!username || !mazoNombre) {
            return res.status(400).json({
                success: false,
                error: "Los parámetros 'username' y 'mazoNombre' son obligatorios en la URL"
            });
        }

        // Primero verificamos si el usuario existe
        const usuarioExiste = await sequelize.query(`
            SELECT id FROM usuario WHERE username = :username
        `, {
            replacements: { username },
            type: sequelize.QueryTypes.SELECT
        });

        if (!usuarioExiste || usuarioExiste.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontró el jugador con nombre de usuario '${username}'`
            });
        }

        const jugadorId = usuarioExiste[0].id;

        // Obtenemos la información básica del mazo
        const infoMazo = await sequelize.query(`
            SELECT 
                md.producto_id AS mazo_id,
                md.nombre AS mazo_nombre,
                md.tipo AS formato_mazo,
                md.nro_cartas,
                u.id AS jugador_id,
                u.username AS jugador_nombre
            FROM mazo_derivado md
            INNER JOIN usuario u ON md.usuario_id = u.id
            WHERE md.usuario_id = :jugadorId 
            AND md.nombre = :mazoNombre
            LIMIT 1
        `, {
            replacements: { jugadorId, mazoNombre },
            type: sequelize.QueryTypes.SELECT
        });

        if (!infoMazo || infoMazo.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontró el mazo '${mazoNombre}' para el jugador con nombre de usuario '${username}'`
            });
        }

        // Obtenemos las cartas del mazo
        const cartasMazo = await sequelize.query(`
            SELECT 
                c.producto_id AS carta_id,
                c.nombre AS carta_nombre,
                c.rareza,
                c.clasificacion AS tipo_carta,
                c.costo_mana,
                c.legalidad,
                col.nombre AS coleccion,
                d.nombre AS dibujante
            FROM mazo_carta mc
            INNER JOIN cartas c ON mc.carta_id = c.producto_id
            LEFT JOIN coleccion col ON c.coleccion_id = col.id
            LEFT JOIN dibujante d ON c.dibujante_id = d.id
            WHERE mc.mazo_id = :mazoId
            ORDER BY c.nombre
        `, {
            replacements: { mazoId: infoMazo[0].mazo_id },
            type: sequelize.QueryTypes.SELECT
        });

        // Construimos la respuesta
        const resultado = {
            mazo_id: infoMazo[0].mazo_id,
            mazo_nombre: infoMazo[0].mazo_nombre,
            formato_mazo: infoMazo[0].formato_mazo,
            nro_cartas: infoMazo[0].nro_cartas,
            jugador_id: infoMazo[0].jugador_id,
            jugador_nombre: infoMazo[0].jugador_nombre,
            cartas: cartasMazo.map(carta => ({
                carta_id: carta.carta_id,
                nombre: carta.carta_nombre,
                rareza: carta.rareza,
                tipo: carta.tipo_carta,
                costo_mana: carta.costo_mana,
                legalidad: carta.legalidad,
                coleccion: carta.coleccion,
                dibujante: carta.dibujante
            }))
        };

        res.status(200).json({
            success: true,
            data: resultado
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor al obtener información del mazo"
        });
    }
};



