import app from './app.js';
import pool from './config/database.js';

let port = process.env.PORT || 3000;

async function main(){
    try{
        let q = await pool.query('SELECT 1');
        console.log(q.rows)
        console.log("la conexcion con la base de datos fue exitosa.");
        app.listen(port, () => {
            console.log(`El servidor esta corriendo en el puerto ${port}`);
        });
    } catch (error){
        console.error("No se puede conectar a la base de datos:", error);
    }
};

main();