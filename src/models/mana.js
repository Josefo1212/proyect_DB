import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mana = sequelize.define('mana', {
  tipo: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  blanco: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  azul: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  negro: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rojo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  verde: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
},
    {
    tableName: 'mana',
    timestamps: false,
}
);

export default Mana;