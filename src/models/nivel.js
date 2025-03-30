import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Nivel = sequelize.define('nivel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  valor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
},
{
  tableName: 'nivel',
  timestamps: false,
});

export default Nivel;
