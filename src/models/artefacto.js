import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Artefacto = sequelize.define('artefacto',{
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
    tableName: 'artefacto',
    timestamps: false,
});

Artefacto.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Artefacto;