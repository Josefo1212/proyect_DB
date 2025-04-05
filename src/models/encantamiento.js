import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cartas from './carta.js';
import Capitulo from './capitulo.js';
import Nivel from './nivel.js';

const Encantamiento = sequelize.define('encantamiento',{
    carta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Cartas,
            key: 'producto_id',
        },
    },
    capitulo_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Capitulo,
            key: 'id',
        },
    },
    nivel_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Nivel,
            key: 'id',
        },
    },
},
{
    tableName: 'encantamiento',
    timestamps: false,
});

Encantamiento.belongsTo(Cartas, {foreignKey:'carta_id'});
Encantamiento.belongsTo(Capitulo, {foreignKey:'capitulo_id'});
Encantamiento.belongsTo(Nivel, {foreignKey:'nivel_id'});

export default Encantamiento;