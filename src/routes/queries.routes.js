import { Router } from 'express';
import { getCartasByColeccion, getColeccionesByCarta, getCardCategoriesByCollection, getCartasByColorAndDate, getMazoInfoByJugador, getUserOffersAndStats } from '../controllers/queries.controller.js';

const router = Router();

// Ruta GET para obtener cartas por nombre de colección
router.get('/cartas/coleccion', getCartasByColeccion);

// Ruta GET para obtener colecciones por nombre de carta
router.get('/colecciones/por-carta', getColeccionesByCarta);

// Ruta GET para mostrar la cantidad de categorías de cartas dentro de una colección por nombre
router.get('/colecciones/categorias', getCardCategoriesByCollection);

// Ruta GET para filtrar cartas por color, rango de fechas y multicolor
router.get('/cartas/filtrarPorColorFecha', getCartasByColorAndDate);
// Ruta GET para obtener ofertas y estadísticas de un usuario
router.get('/usuarios/ofertas-estadisticas', getUserOffersAndStats);
// Ruta GET para obtener información sobre el mazo de un jugador
router.get('/mazos/por-jugador', getMazoInfoByJugador);



export default router;