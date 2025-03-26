import pool from '../config/database.js'; // Importa el pool configurado
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req, res) => {
    const { username, password } = req.body;
    try {

        const userExists = await pool.query(
            'SELECT * FROM usuario where username = $1',
            [username]
        );

        console.log(userExists.rows);

        if(userExists.rows.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuario (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM usuario WHERE username = $1';
        const values = [username];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "password incorrecta" });
        }

        console.log(user)
        // Create a session for the user
        req.session.userId = user.id;

        res.json({ message: "Inicio de sesión exitoso", success: true});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const userId = req.session.userId; // Retrieve userId from session
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const query = 'SELECT id, username FROM users WHERE id = $1';
        const values = [userId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
