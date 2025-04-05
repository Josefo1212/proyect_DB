import Cartas from '../models/carta.js';
import Coleccion from '../models/coleccion.js';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
dotenv.config();

// Obtener cartas por colección (usando GET con query params)
export const getCartasByColeccion = async (req, res) => {
    const { coleccionId } = req.query;

    try {
        if (!coleccionId) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'coleccionId' es obligatorio en la URL"
            });
        }

        const cartas = await Cartas.findAll({ 
            where: { coleccion_id: coleccionId },
            attributes: ['producto_id', 'nombre', 'rareza', 'dibujante_id', 'flavor_text', 'coleccion_id'] // Selecciona campos específicos
        });

        if (!cartas || cartas.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron cartas para la colección ${coleccionId}`
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
    const { cartaId } = req.query;

    try {
        if (!cartaId) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'cartaId' es obligatorio en la URL"
            });
        }

        const carta = await Cartas.findOne({
            where: { producto_id: cartaId },
            attributes: ['producto_id', 'nombre', 'rareza', 'dibujante_id', 'flavor_text', 'coleccion_id'], // Detalles de la carta
            include: [{
                model: Coleccion, // Asegúrate de importar el modelo Colecciones
                attributes: ['id', 'nombre', 'descripcion'] // Resumen de la colección
            }]
        });

        if (!carta) {
            return res.status(404).json({
                success: false,
                error: `No se encontró información para la carta con ID ${cartaId}`
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
    const { coleccionId } = req.query;

    try {
        if (!coleccionId) {
            return res.status(400).json({
                success: false,
                error: "El parámetro 'coleccionId' es obligatorio en la URL"
            });
        }

        const cardCategories = await Cartas.findAll({
            where: { coleccion_id: coleccionId },
            attributes: ['categoria', [sequelize.fn('COUNT', sequelize.col('categoria')), 'cantidad']],
            group: ['categoria']
        });

        if (!cardCategories || cardCategories.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron categorías de cartas para la colección ${coleccionId}`
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
    const { color, fechaInicio, fechaFin, multicolor } = req.query;

    try {
        if (!color || !fechaInicio || !fechaFin) {
            return res.status(400).json({
                success: false,
                error: "Los parámetros 'color', 'fechaInicio' y 'fechaFin' son obligatorios en la URL"
            });
        }

        const whereConditions = {
            color: color,
            fecha_impresion: {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            }
        };

        if (multicolor !== undefined) {
            whereConditions.multicolor = multicolor === 'true';
        }

        const cartas = await Cartas.findAll({
            where: whereConditions,
            attributes: ['producto_id', 'nombre', 'color', 'fecha_impresion', 'multicolor', 'coleccion_id']
        });

        if (!cartas || cartas.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontraron cartas del color ${color} impresas entre ${fechaInicio} y ${fechaFin}`
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
