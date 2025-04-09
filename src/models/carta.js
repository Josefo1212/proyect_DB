import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Producto from './producto.js';
import Dibujante from './dibujante.js';
import Coleccion from './coleccion.js';


const Cartas = sequelize.define('cartas', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Producto,
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
      model: Dibujante,
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
      model: Coleccion,
      key: 'id',
    },
  },
  fecha_impresion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  costo_mana: {
    type: DataTypes.STRING,
    allowNull: false,
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
