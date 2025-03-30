import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Caja = sequelize.define('caja', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro_sobres: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  tableName: 'caja',
  timestamps: false,
}
);

export default Caja;
