import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Subtipo = sequelize.define('subtipo',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_subtipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'subtipo',
    timestamps: false,
});

export default Subtipo;