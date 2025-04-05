import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Dibujante = sequelize.define('dibujante',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'dibujante',
    timestamps: false,
});

export default Dibujante;