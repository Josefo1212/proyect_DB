import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const Persona = sequelize.define('persona', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  tableName: 'persona',
  timestamps: false,
});

Persona.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Persona;
