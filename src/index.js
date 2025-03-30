import app from './app.js';
import sequelize from './config/database.js';

let port = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.sync({force: false});
    console.log("La conexión con la base de datos fue exitosa.");
    app.listen(port, () => {
      console.log(`El servidor está corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No se puede conectar a la base de datos:", error);
  }
}

main();