import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Planeswolker = sequelize.define('planeswolker',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
    contador_lealtad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    tableName: 'planeswolker',
    timestamps: false,
});

Planeswolker.belongsTo(Cartas, {foreignKey:'carta_id'});
export default Planeswolker;