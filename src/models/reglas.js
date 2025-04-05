import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Reglas = sequelize.define('reglas',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    texto_regla: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo_regla: {
        types: DataTypes.STRING,
        allowNull: false,
    },
    condiciones: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    efecto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'reglas',
    timestamps: false,
});

export default Reglas;