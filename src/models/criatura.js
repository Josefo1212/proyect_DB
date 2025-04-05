import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Criatura = sequelize.define('criatura',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
    poder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    resistencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    tableName: 'criatura',
    timestamps: false,
});

Criatura.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Criatura;