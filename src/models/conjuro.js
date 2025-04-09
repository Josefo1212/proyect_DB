import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Conjuro = sequelize.define('conjuro',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
    efecto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'conjuro',
    timestamps: false,
});

Conjuro.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Conjuro;