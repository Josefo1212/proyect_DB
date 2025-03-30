import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Producto = sequelize.define('producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
    {
    tableName: 'producto',
    timestamps: false,
}
);

export default Producto;