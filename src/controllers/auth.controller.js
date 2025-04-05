import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Usuario from '../models/usuario.js';
import Persona from '../models/persona.js';
import Admin from '../models/admin.js';

dotenv.config();

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (password.length < 8 || password.length > 15) {
      return res.status(400).json({ message: "La contraseña debe tener entre 8 y 15 caracteres." });
    }

    const userExists = await Usuario.findOne({ where: { [Sequelize.Op.or]: [{ username }, { email }] } });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Usuario.create({ username, password: hashedPassword, email });

    await Persona.create({ usuario_id: newUser.id });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, admin_code } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrecta" });
    }

    let isAdmin = false;

    if (admin_code) {
      const adminCode = await Admin.findOne({ where: { admin_code, usuario_id: user.id } });
      if (adminCode) {
        isAdmin = true;
      } else {
        return res.status(403).json({ message: "Este codigo admin no pertenece a este usuario" });
      }
    }

    req.session.userId = user.id;

    res.json({ 
      message: "Inicio de sesion exitoso", 
      success: true, 
      isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    // Verificar si la sesión está activa
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ 
        message: "No autorizado", 
        success: false 
      });
    }

    const userId = req.session.userId;

    // Buscar al usuario por ID
    const user = await Usuario.findByPk(userId, { attributes: ['id', 'username', 'email'] });

    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado", 
        success: false 
      });
    }

    // Respuesta exitosa con los datos del usuario
    res.json({ 
      message: "Perfil obtenido exitosamente", 
      success: true, 
      user 
    });
  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ 
      message: "Error interno del servidor", 
      success: false 
    });
  }
};
