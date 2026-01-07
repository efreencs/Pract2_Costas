const Library = require('../models/Library');

const libraryController = {

  createLibrary: async (req, res) => {
    try {

        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }

        const { nom, ciutat, adreca, telefon } = req.body;
        if (!nom || !ciutat || !adreca) {
            return res.status(400).json({ message: 'Falten camps obligatoris' });
        }

        const bibliotecaExistente = await Library.findOne({ nom });
        if (bibliotecaExistente) {
            return res.status(400).json({ message: 'Ja existeix una biblioteca amb aquest nom' });
        }

        const novaBiblioteca = new Library({
            nom,
            ciutat,
            adreca,
            telefon
        });
        await novaBiblioteca.save();
        res.status(201).json(novaBiblioteca);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllLibraries: async (req, res) => {
    try {
        const llibreries = await Library.find();
        res.status(200).json(llibreries);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLibraryById: async (req, res) => {
    try {
        const { id } = req.params;
        const biblioteca = await Library.findById(id);
        if (!biblioteca) {
            return res.status(404).json({ message: 'Biblioteca no trobada' });
        }
        res.status(200).json(biblioteca);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateLibrary: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const { id } = req.params;
        const { nom, ciutat, adreca, telefon } = req.body;
        if (!nom || !ciutat || !adreca) {
            return res.status(400).json({ message: 'Falten camps obligatoris' });
        }
        const biblioteca = await Library.findById(id);
        if (!biblioteca) {
            return res.status(404).json({ message: 'Biblioteca no trobada' });
        }
        const bibliotecaExistente = await Library.findOne({ nom, _id: { $ne: id } });
        if (bibliotecaExistente) {
            return res.status(400).json({ message: 'Ja existeix una altra biblioteca amb aquest nom' });
        }
        biblioteca.nom = nom;
        biblioteca.ciutat = ciutat;
        biblioteca.adreca = adreca;
        biblioteca.telefon = telefon;
        await biblioteca.save();
        res.status(200).json(biblioteca);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteLibrary: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const { id } = req.params;
        const biblioteca = await Library.findById(id);
        if (!biblioteca) {
            return res.status(404).json({ message: 'Biblioteca no trobada' });
        }
        await Library.findByIdAndDelete(id);
        res.status(200).json({ message: 'Biblioteca esborrada correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLibrariesByCity: async (req, res) => {
    try {
        const ciutat = req.params.ciutat;
        const biblioteques = await Library.find({ ciutat });
        res.status(200).json(biblioteques);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchLibraries: async (req, res) => {
    try {
        const query = req.query.q || req.query.search;
        const regex = new RegExp(query, 'i');
        const biblioteques = await Library.find({ $or: [ { nom: regex }, { ciutat: regex } ] });
        res.status(200).json(biblioteques);


    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = libraryController;
