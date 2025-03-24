import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';


const profiles = sequelize.define("profiles",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    profiles:{
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default profiles;