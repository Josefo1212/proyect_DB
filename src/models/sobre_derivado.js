import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Producto from './producto.js';
import usuario from './usuario.js';

const Sobre_derivado = sequelize.define('sobre_derivado', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Producto,
      key: 'id',
    },
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro_cartas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_coleccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario_id:{
    type: DataTypes.INTEGER,
    references: {
      model: usuario,
      key: 'id',
    },
  }
},
{
  tableName: 'sobre_derivado',
  timestamps: false,
}
);

Sobre_derivado.belongsTo(Producto, { foreignKey: 'producto_id' });
Sobre_derivado.belongsTo(usuario, { foreignKey: 'usuario_id' });
export default Sobre_derivado;
