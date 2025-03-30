import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Capitulo = sequelize.define('capitulo', {
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
  tableName: 'capitulo',
  timestamps: false,
});

export default Capitulo;
