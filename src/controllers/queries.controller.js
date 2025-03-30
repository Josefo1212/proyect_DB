import Cartas from '../models/carta';
import dotenv from 'dotenv';

dotenv.config();

// Mostrar las cartas de una colección
export const getCartasByColeccion = async (req, res) => {
    const { coleccionId } = req.params; // Obtener el ID de la colección desde los parámetros de la URL

    try {
        const cartas = await Cartas.findAll({ where: { coleccion_id: coleccionId } }); // Usar Sequelize para la consulta

        if (cartas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cartas para esta colección' });
        }

        res.json(cartas); // Devolver las cartas encontradas
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        res.status(500).json({ message: 'Error al obtener las cartas' });
    }
};