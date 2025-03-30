import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Producto from './producto.js';

const Mazo_derivado = sequelize.define('mazo_derivado', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Producto',
      key: 'id',
    },
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro_cartas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
},
{
  tableName: 'mazo_derivado',
  timestamps: false,
}
);

Mazo_derivado.belongsTo(Producto, { foreignKey: 'producto_id' });
export default Mazo_derivado;
