import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Producto from './producto.js';

const Comercio = sequelize.define('inventario',{
    vendedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id',
        },
    },
    comprador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id',
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
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
},
{
    tableName: 'comcercio',
    timestamps: false,
    uniqueKeys: {
        comercio_compuesto: {
          fields: ['vendedor_id', 'comprador_id', 'producto_id'], // Define la clave primaria compuesta
        },
      },
});

Comercio.belongsTo(Usuario, { foreignKey: 'vendedor_id' });
Comercio.belongsTo(Usuario, { foreignKey: 'comprador_id' });
Comercio.belongsTo(Producto, { foreignKey: 'producto_id' });
export default Comercio;