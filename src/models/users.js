import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

 const users = sequelize.define("users",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

} );

export default users;