import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const Admin = sequelize.define('admin', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  admin_code: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  },
  fecha_designacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
{
  tableName: 'admin',
  timestamps: false,
});

Admin.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Admin;
