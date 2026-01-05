const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  register: async (req, res) => {
    try {

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Tots els camps són obligatoris' });
    }

    const Usuari = new User({
        nom: username,
        contrasenya: password,
        email: email
    });

    await Usuari.save();

    res.status(201).json({ 
      missatge: 'Usuari creat correctament',
      user: { id: Usuari._id, nom: Usuari.nom, email: Usuari.email }
    });

    } catch (error) {
       res.status(500).json({ error: error.message });
    }
  },
  
  login: async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuari = await User.findOne({ email: email });

        if (!usuari) {
            return res.status(400).json({ message: 'Credencials invàlides' });
        }

        const esContrasenyaValida = await bcrypt.compare(password, usuari.contrasenya);

        if (!esContrasenyaValida) {
            return res.status(400).json({ message: 'Credencials invàlides' });
        }

        const token = jwt.sign(
            { userId: usuari._id, rol: usuari.rol },
            process.env.JWT_SECRET,
            { expiresIn: '120h' }
        );

        res.json({ token , user: usuari });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
        const ID = req.user.userId;

        const usuari = await User.findById(ID);
        if (!usuari) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }
        res.status(200).json({
            id: usuari._id,
            nom: usuari.nom,
            email: usuari.email,
            rol: usuari.rol,
            dataRegistre: usuari.dataRegistre
        });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
        const ID = req.user.userId;
        const { nom, email } = req.body;

        if (!nom || !email) {
            return res.status(400).json({ message: 'Tots els camps són obligatoris' });
        }

        const duplicat = await User.findOne({ email: email });
        if (duplicat && duplicat._id.toString() !== ID) {
            return res.status(400).json({ message: 'L\'email ja està en ús' });
        }

        const usuari = await User.findById(ID);
        if (!usuari) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }

        usuari.nom = nom;
        usuari.email = email;
        await usuari.save();
        res.status(200).json({
            message: 'Perfil actualitzat correctament',
            user: {
                id: usuari._id,
                nom: usuari.nom,
                email: usuari.email
            }
        });
        
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      // Obtenir ID de req.user
      // Extreure contrasenyaAntiga, contrasenyaNova, confirmarContrasenyaNova de req.body
      // Validar que totes estan completes
      // Validar que contrasenyaNova === confirmarContrasenyaNova
      // Buscar usuari a BD
      // Si no existeix → retornar 404
      // Comparar contrasenya antiga amb bcrypt.compare()
      // Si no coincideix → retornar 401
      // Si coincideix → Actualitzar contrasenya
      // Guardar a BD
      // Retornar 200
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      // Obtenir ID de req.user
      // Buscar usuari a BD
      // Si no existeix → retornar 404
      // Esborrar usuari amb findByIdAndDelete
      // Retornar 200
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Validar que req.user.rol === 'ADMIN'
      // Si no és admin → retornar 403
      // Buscar tots els usuaris amb User.find()
      // Retornar 200 amb array (sense contrasenyes)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      // Validar que és ADMIN
      // Extreure id de req.params
      // Buscar usuari per ID
      // Si no existeix → retornar 404
      // Retornar 200 amb dades (sense contrasenya)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
};

module.exports = userController;