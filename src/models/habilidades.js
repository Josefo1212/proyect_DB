import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Habilidades = sequelize.define('habilidades', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  tableName: 'habilidades',
  timestamps: false,
});

export default Habilidades;
