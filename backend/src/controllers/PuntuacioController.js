const Puntuacio = require('../models/Puntuacio');

const PuntuacioController = {

  createPuntuacio: async (req, res) => {
    try {
        const dataActual = new Date();
        const { usuari_id, comptador, nivell } = req.body;
        
        if (!nom_usuari || !nivell) {
            return res.status(400).json({ message: 'Falten camps obligatoris' });
        }        

        const novaPuntuacio = new Puntuacio({
            nom_usuari: usuariId,
            comptador: comptador,
            nivell: nivell,
            dataJoc: dataActual
        });
        await novaPuntuacio.save();
        res.status(201).json(nouPrestec);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualitzarComptador: async (req, res) => {
    try {
        const loanId = req.params.id;

        const prestec = await Loan.findById(loanId);
        if (!prestec) {
            return res.status(404).json({ message: 'Préstec no trobat' });
        }
        if (prestec.estat === 'RETORNAT') {
            return res.status(400).json({ message: 'El préstec ja estava retornat' });
        }
        prestec.dataRetornaReal = new Date();
        prestec.estat = 'RETORNAT';
        const llibre = await Book.findById(prestec.llibre);
        llibre.quantitatDisponible += 1;
        await prestec.save();
        await llibre.save();
        res.status(200).json({ message: 'Préstec retornat correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMyLoans: async (req, res) => {
    try {
        const usuariId = req.user.userId;
        const prestecs = await Loan.find({ usuari: usuariId })
            .populate('llibre');
        res.status(200).json(prestecs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLoansByUser: async (req, res) => {
    try {
        const usuariId = req.user.userId;
        const userRole = req.user.rol;
        let buscarPerUsuariId = usuariId;

        if (userRole === 'ADMIN' && req.params.userId) {
            buscarPerUsuariId = req.params.userId;
        }
        const prestecs = await Loan.find({ usuari: buscarPerUsuariId })
            .populate('llibre');
        res.status(200).json(prestecs);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLoansByLibrary: async (req, res) => {
    try {
        const bibliotecaId = req.params.libraryId;
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }

        let filtros = { biblioteca: bibliotecaId };
        if (req.query.estat) {
            filtros.estat = req.query.estat;
        }
    
        const prestecs = await Loan.find(filtros)
            .populate('usuari')
            .populate('llibre');
        res.status(200).json(prestecs);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLoanById: async (req, res) => {
    try {
        const loanId = req.params.id;
        const prestec = await Loan.findById(loanId)
            .populate('usuari')
            .populate('llibre');
        if (!prestec) {
            return res.status(404).json({ message: 'Préstec no trobat' });
        }
        res.status(200).json(prestec);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateLoanStatus: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const loanId = req.params.id;
        const { nouEstat } = req.body;
        const estatsValids = ['ACTIU', 'RETORNAT', 'ENDARRERIT'];
        if (!estatsValids.includes(nouEstat)) {
            return res.status(400).json({ message: 'Estat no vàlid' });
        }
        const prestec = await Loan.findById(loanId);
        if (!prestec) {
            return res.status(404).json({ message: 'Préstec no trobat' });
        }
        if (nouEstat === 'RETORNAT' && prestec.estat !== 'RETORNAT') {
            prestec.dataRetornaReal = new Date();
            prestec.estat = 'RETORNAT';
            const llibre = await Book.findById(prestec.llibre);
            llibre.quantitatDisponible += 1;
            await llibre.save();
        }
        else if (nouEstat === 'ENDARRERIT') {
            prestec.estat = 'ENDARRERIT';
        }
        await prestec.save();
        res.status(200).json({ message: 'Estat del préstec actualitzat correctament' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllLoans: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }

        let filtres = {};
        if (req.query.estat) {
            filtres.estat = req.query.estat;
        }
        const prestecs = await Loan.find(filtres)
            .populate('usuari')
            .populate('llibre');
        res.status(200).json(prestecs);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOverdueLoans: async (req, res) => {
    try {
        const userRole = req.user.rol;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Accés denegat. Només administradors.' });
        }
        const prestecsEndarrerits = await Loan.find({
            estat: 'ACTIU',
            dataRetornaPrevista: { $lt: new Date() }
        })
        .populate('usuari')
        .populate('llibre');
        res.status(200).json(prestecsEndarrerits);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = loanController;
