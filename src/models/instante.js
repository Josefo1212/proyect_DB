import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Instante = sequelize.define('instante',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
},
{
    tableName: 'instante',
    timestamps: false,
});

Instante.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Instante;