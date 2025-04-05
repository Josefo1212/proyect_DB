import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';


const Sucursal = sequelize.define('sucursal',{
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
    nombre_susucusal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        types: DataTypes.STRING,
        allowNull: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
{
    tableName: 'sucursal',
    timestamps: false,
});

Sucursal.belongsTo(Usuario, { foreignKey: 'usuario_id' });
export default Sucursal;