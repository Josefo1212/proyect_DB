import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Sucursal from './sucursal.js';
import Producto from './producto.js';

const Inventario = sequelize.define('inventario',{
    sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sucursal',
            key: 'usuario_id',
        },
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'producto',
            key: 'id',
        },
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    tableName: 'inventario',
    timestamps: false,
    uniqueKeys: {
        inventario_compuesto: {
          fields: ['sucursal_id', 'producto_id'], // Define la clave primaria compuesta
        },
      },
});

Inventario.belongsTo(Sucursal, { foreignKey: 'sucursal_id' });
Inventario.belongsTo(Producto, { foreignKey: 'producto_id' });
export default Inventario;