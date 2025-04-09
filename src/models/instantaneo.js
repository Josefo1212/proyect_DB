import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Instantaneo = sequelize.define('instantaneo',{
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
    tableName: 'instantaneo',
    timestamps: false,
});

Instantaneo.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Instantaneo;