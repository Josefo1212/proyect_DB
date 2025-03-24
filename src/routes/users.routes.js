import {Router} from 'express';
import {getUsers,createtUsers, updateUsers, deleteUsers, getUser} from '../controllers/users.controller.js'
const router = Router();

router.get('/users',getUsers)//ruta para obtener los datos de los usuarios
router.post('/users',createtUsers)//ruta para crear un nuevo usuario
router.put('/users/:id',updateUsers)//ruta para actualizar los datos de un usuario
router.delete('/users/:id',deleteUsers)//ruta para eliminar un usuario
router.get('/users/:id',getUser )//ruta para obtener los datos de un usuario



export default router;