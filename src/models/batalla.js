import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';

const Batalla = sequelize.define('batalla',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
    defensa: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_batalla: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'batalla',
    timestamps: false,
});

Batalla.belongsTo(Cartas, {foreignKey:'carta_id'});

export default Batalla;