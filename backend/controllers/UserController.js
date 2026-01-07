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
        email: email,
    });

    await Usuari.save();

    res.status(201).json({ 
      missatge: 'Usuari creat correctament',
      user: { id: Usuari._id, nom: Usuari.nom, email: Usuari.email, rol: Usuari.rol }
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

        const esContrasenyaValida = await usuari.compararContrasenya(password, usuari.contrasenya);

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
        const ID = req.user.userId;
        const { contrasenyaAntiga, contrasenyaNova, confirmarContrasenyaNova } = req.body;

        if (!contrasenyaAntiga || !contrasenyaNova || !confirmarContrasenyaNova) { 
            return res.status(400).json({ message: 'Tots els camps són obligatoris' });
        }
        if (contrasenyaNova !== confirmarContrasenyaNova) {
            return res.status(400).json({ message: 'La nova contrasenya i la confirmació no coincideixen' });
        }
        const usuari = await User.findById(ID);
        if (!usuari) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }

        const esContrasenyaValida = await usuari.compararContrasenya(contrasenyaAntiga, usuari.contrasenya);
      // Obtenir ID de req.user
        if (!esContrasenyaValida) {
            return res.status(401).json({ message: 'Contrasenya antiga incorrecta' });
        }

        usuari.contrasenya = contrasenyaNova;
        await usuari.save();
        res.status(200).json({ message: 'Contrasenya actualitzada correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
        const ID = req.user.userId;

        const usuari = await User.findById(ID);
        if (!usuari) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }
        await User.findByIdAndDelete(ID);
        res.status(200).json({ message: 'Usuari esborrat correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
        if (req.user.rol !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat' });
        }
        const usuaris = await User.find({}, '-contrasenya');
        res.status(200).json(usuaris);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {

        if (req.user.rol !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat' });
        }

        const userId = req.params.id;

        const usuari = await User.findById(userId, '-contrasenya');
        if (!usuari) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }
        res.status(200).json(usuari);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
};

module.exports = userController;