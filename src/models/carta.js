import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Producto from './producto.js';

const Cartas = sequelize.define('cartas', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'producto',
      key: 'id',
    },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rareza: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
        isIn: {
            args: [['comun', 'infrecuente', 'rara', 'mitica','foil']],
            msg: 'La rareza debe ser comun, infrecuente, rara, mitica o foil',
        },
    }
  },
  dibujante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dibujante',
      key: 'id',
    },
},
  flavor_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  snow: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  legendary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  legalidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clasificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coleccion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'coleccion',
      key: 'id',
    },
  },
},
{
  tableName: 'cartas',
  timestamps: false,
}
);
Cartas.belongsTo(Producto, { foreignKey: 'producto_id' });
Cartas.belongsTo(Dibujante, { foreignKey: 'dibujante_id' });
Cartas.belongsTo(Coleccion, { foreignKey: 'coleccion_id' });
export default Cartas;
