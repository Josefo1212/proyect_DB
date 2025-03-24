import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await users.create({ username, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await users.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "password incorrecta" });
        }

        const token = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const profiles = await profile(user.id)

        res.json({ token, profiles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const userId = req.userId; // Ensure userId is extracted correctly
        const user = await users.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        res.json('ACHU');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
