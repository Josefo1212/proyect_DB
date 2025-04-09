import sequelize from '../config/database.js';
import Cartas from '../models/carta.js';
import Mana from '../models/mana.js';
import Coleccion from '../models/coleccion.js';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
dotenv.config();

// Mostrar las cartas de una colección. 
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

// Obtener colecciones donde se puede hallar una carta
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

// Mostrar la cantidad de criaturas, instantáneos, encantamientos, conjuros y cualquier otra categoría de carta dentro de una colección
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

// Obtener cartas de un color específico impresas entre dos fechas, con opción de filtrar por multicolor
export const getCartasByColorAndDate = async (req, res) => {
    const { color, fechaInicio, fechaFin, multicolor = 'all' } = req.query;

    try {
        // Validar parámetros requeridos
        const coloresValidos = ['blanco', 'azul', 'negro', 'rojo', 'verde'];
        if (!color || !coloresValidos.includes(color.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'color' es obligatorio y debe ser uno de: blanco, azul, negro, rojo, verde"
            });
        }

        // Validar parámetro multicolor
        if (!['all', 'true', 'false'].includes(multicolor)) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'multicolor' debe ser: all, true o false"
            });
        }

        // Construir consulta para PostgreSQL
        const query = `
            SELECT c.producto_id, c.nombre, c.fecha_impresion, c.costo_mana, 
                   col.nombre AS coleccion, d.nombre AS dibujante,
                   STRING_AGG(DISTINCT m.tipo, ', ') AS colores_mana,
                   CASE 
                     WHEN COUNT(DISTINCT CASE 
                       WHEN m.blanco = true THEN 'blanco'
                       WHEN m.azul = true THEN 'azul'
                       WHEN m.negro = true THEN 'negro'
                       WHEN m.rojo = true THEN 'rojo'
                       WHEN m.verde = true THEN 'verde'
                     END) > 1 THEN 'multicolor'
                     ELSE 'monocolor'
                   END AS tipo_carta
            FROM cartas c
            JOIN carta_mana cm ON c.producto_id = cm.carta_id
            JOIN mana m ON cm.mana_tipo = m.tipo
            JOIN coleccion col ON c.coleccion_id = col.id
            JOIN dibujante d ON c.dibujante_id = d.id
            WHERE 
              ($1 = 'blanco' AND m.blanco = true) OR
              ($1 = 'azul' AND m.azul = true) OR
              ($1 = 'negro' AND m.negro = true) OR
              ($1 = 'rojo' AND m.rojo = true) OR
              ($1 = 'verde' AND m.verde = true)
            AND ($2 IS NULL OR c.fecha_impresion >= $2::date)
            AND ($3 IS NULL OR c.fecha_impresion <= $3::date)
            GROUP BY c.producto_id, col.nombre, d.nombre
            HAVING 
              ($4 = 'all' OR 
               ($4 = 'true' AND COUNT(DISTINCT CASE 
                 WHEN m.blanco = true THEN 'blanco'
                 WHEN m.azul = true THEN 'azul'
                 WHEN m.negro = true THEN 'negro'
                 WHEN m.rojo = true THEN 'rojo'
                 WHEN m.verde = true THEN 'verde'
               END) > 1) OR
               ($4 = 'false' AND COUNT(DISTINCT CASE 
                 WHEN m.blanco = true THEN 'blanco'
                 WHEN m.azul = true THEN 'azul'
                 WHEN m.negro = true THEN 'negro'
                 WHEN m.rojo = true THEN 'rojo'
                 WHEN m.verde = true THEN 'verde'
               END) = 1))
            ORDER BY c.nombre;
        `;

        const cartas = await sequelize.query(query, {
            bind: [color, fechaInicio || null, fechaFin || null, multicolor],
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
// Obtener información sobre el mazo de un jugador
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
