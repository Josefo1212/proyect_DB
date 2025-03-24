import Users from './users.js';
import Profiles from './profiles_name.js';

// Definir la asociación de muchos a muchos entre Users y Profiles
Users.belongsToMany(Profiles, { through: 'users_profiles' });
Profiles.belongsToMany(Users, { through: 'users_profiles' });