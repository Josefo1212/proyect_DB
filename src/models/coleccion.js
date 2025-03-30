import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Coleccion = sequelize.define('coleccion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre:  {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  tableName: 'coleccion',
  timestamps: false,
});

export default Coleccion;
