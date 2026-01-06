const Book = require('../models/Book');

const bookController = {
  
  createBook: async (req, res) => {
    try {

        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }

        const { titol, autor, any, isbn, categoria, quantitatTotal } = req.body;

        if (!titol || !autor || !any || !isbn || !categoria || !quantitatTotal) {
            return res.status(400).json({ message: 'Tots els camps són obligatoris.' });
        }
        const llibreExistente = await Book.findOne({ isbn });
        if (llibreExistente) {
            return res.status(400).json({ message: 'Ja existeix un llibre amb aquest ISBN.' });
        }
        if (quantitatTotal <= 0) {
            return res.status(400).json({ message: 'La quantitat total ha de ser major que zero.' });
        }

        const nouLlibre = new Book({
            titol,
            autor,
            any,
            isbn,
            categoria,
            quantitatTotal,
            quantitatDisponible: quantitatTotal
        });
        await Book.save();
        res.status(201).json(nouLlibre);
        
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllBooks: async (req, res) => {
    try {
        let filtres = {};

        if (req.query.disponibles === 'true') {
            filtres.quantitatDisponible = { $gt: 0 };
        } else if (req.query.disponibles === 'false') {
            filtres.quantitatDisponible = 0;
        }
        
        const llibres = await Book.find(filtres);
        res.status(200).json(llibres);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBookById: async (req, res) => {
    try {
        const bookId = req.params.id;

        const llibre = await Book.findById(bookId);
        if (!llibre) {
            return res.status(404).json({ message: 'Llibre no trobat' });
        }
        res.status(200).json(llibre);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateBook: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const bookId = req.params.id;
        const { titol, autor, any, categoria, quantitatTotal } = req.body;

        if (!titol || !autor || !any || !categoria || !quantitatTotal) {
            return res.status(400).json({ message: 'Tots els camps són obligatoris.' });
        }
        const llibre = await Book.findById(bookId);
        if (!llibre) {
            return res.status(404).json({ message: 'Llibre no trobat' });
        }
        llibre.titol = titol;
        llibre.autor = autor;
        llibre.any = any;
        llibre.categoria = categoria;
        if (quantitatTotal < llibre.quantitatTotal - llibre.quantitatDisponible) {
            return res.status(400).json({ message: 'La nova quantitat total és massa baixa per la quantitat ja prestada.' });
        }
        if (quantitatTotal !== llibre.quantitatTotal) {
            const diferència = quantitatTotal - llibre.quantitatTotal;
            llibre.quantitatTotal = quantitatTotal;
            llibre.quantitatDisponible += diferència;
        }
        await llibre.save();
        res.status(200).json(llibre);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBook: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const bookId = req.params.id;
        const llibre = await Book.findById(bookId);
        if (!llibre) {
            return res.status(404).json({ message: 'Llibre no trobat' });
        }
        await Book.findByIdAndDelete(bookId);
        res.status(200).json({ message: 'Llibre esborrat correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchBooks: async (req, res) => {
    try {
        const query = req.query.q|| req.query.search;
        const regex = new RegExp(query, 'i');
        const llibres = await Book.find({ $or: [ { titol: regex }, { autor: regex } ] });
        res.status(200).json(llibres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBooksByCategory: async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const categoriesValides = ['Ficció', 'Ciència', 'História', 'Tecnologia', 'Autoayuda', 'Altres'];
        if (!categoriesValides.includes(categoria)) {
            return res.status(400).json({ message: 'Categoria no vàlida' });
        }
        const llibres = await Book.find({ categoria });
        res.status(200).json(llibres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = bookController;
