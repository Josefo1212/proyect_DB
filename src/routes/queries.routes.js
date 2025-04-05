import { Router } from 'express';
import { getCartasByColeccion, getColeccionesByCarta, getCardCategoriesByCollection, getCartasByColorAndDate } from '../controllers/queries.controller.js';

const router = Router();

// Ruta GET para filtrar cartas por coleccionId (vía query params)
router.get('/cartas', getCartasByColeccion);

// Ruta GET para obtener colecciones por cartaId (vía query params)
router.get('/colecciones/carta', getColeccionesByCarta);

// Ruta GET para mostrar la cantidad de categorías de cartas dentro de una colección
router.get('/cartas/categorias', getCardCategoriesByCollection);

// Ruta GET para filtrar cartas por color, rango de fechas y multicolor
router.get('/cartas/filtrar', getCartasByColorAndDate);

export default router;