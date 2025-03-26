import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool();

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createtUsers = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );
        res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *',
            [username, password, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};