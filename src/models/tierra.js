import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Tierra = sequelize.define('tierra',{
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
    tableName: 'tierra',
    timestamps: false,
});

Tierra.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Tierra;