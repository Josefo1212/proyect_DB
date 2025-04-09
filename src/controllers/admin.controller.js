import sequelize from '../config/database.js';

class AdminController {
    constructor() {}

    async create(tableName, data) {
        try {
            const keys = Object.keys(data).join(', ');
            const values = Object.values(data);
            const placeholders = values.map(() => '?').join(', ');
            const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
            await sequelize.query(query, { replacements: values });
            return { success: true, message: 'Registro creado exitosamente' };
        } catch (error) {
            console.error(`Error al crear en la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async read(tableName, query = {}) {
        try {
            const keys = Object.keys(query);
            const values = Object.values(query);
            const whereClause = keys.length > 0 ? `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}` : '';
            const sqlQuery = `SELECT * FROM ${tableName} ${whereClause}`;
            const [results] = await sequelize.query(sqlQuery, { replacements: values });
            return { success: true, data: results };
        } catch (error) {
            console.error(`Error al leer de la tabla ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async update(tableName, id, data) {
        try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
            const [result] = await sequelize.query(query, { replacements: [...values, id] });
            if (result.affectedRows === 0) {
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
            const query = `DELETE FROM ${tableName} WHERE id = ?`;
            const [result] = await sequelize.query(query, { replacements: [id] });
            if (result.affectedRows === 0) {
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
