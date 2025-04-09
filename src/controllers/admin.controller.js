import sequelize from '../config/database.js';

class AdminController {
    constructor() {}

    async create(tableName, data) {
        try {
            const result = await sequelize.models[tableName].create(data);
            return { success: true, data: result };
        } catch (error) {
            console.error(`Error al crear en la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async read(tableName, query = {}) {
        try {
            const result = await sequelize.models[tableName].findAll({ where: query });
            return { success: true, data: result };
        } catch (error) {
            console.error(`Error al leer de la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async update(tableName, id, data) {
        try {
            const result = await sequelize.models[tableName].update(data, { where: { id } });
            if (result[0] === 0) {
                return { success: false, error: `No se encontró ningún registro con el id ${id}` };
            }
            return { success: true, message: `Registro con el id ${id} actualizado exitosamente` };
        } catch (error) {
            console.error(`Error al actualizar la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async delete(tableName, id) {
        try {
            const result = await sequelize.models[tableName].destroy({ where: { id } });
            if (result === 0) {
                return { success: false, error: `No se encontró ningún registro con el id ${id}` };
            }
            return { success: true, message: `Registro con el id ${id} eliminado exitosamente` };
        } catch (error) {
            console.error(`Error al eliminar de la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }
}

export default new AdminController();
