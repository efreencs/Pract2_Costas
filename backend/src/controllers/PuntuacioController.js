const Puntuacio = require('../models/Puntuacio');

const PuntuacioController = {

  createPuntuacio: async (req, res) => {
    try {
        const dataActual = new Date();
        const { usuariId, comptador, nivell } = req.body;
        const puntuacio = Math.floor(
        (new Date(dataFinal) - new Date(dataInici)) / 1000
        );

        if (!usuariId || !nivell) {
            return res.status(400).json({ message: 'Falten camps obligatoris' });
        }

        const novaPuntuacio = new Puntuacio({
            nom_usuari: usuariId,
            puntuacio: puntuacio,
            nivell: nivell,
            dataJoc: dataActual
        });
        await novaPuntuacio.save();
        res.status(201).json(novaPuntuacio);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualitzarComptador: async (req, res) => {
    try {
        const puntuacioId = req.params.id;
        const { nouComptador } = req.body;
        const puntuacio = await Puntuacio.findById(puntuacioId);
        if (!puntuacio) {
            return res.status(404).json({ message: 'Puntuacio no trobat' });
        }
        puntuacio.comptador = nouComptador;
        await puntuacio.save();
        res.status(200).json({ message: 'Comptador actualitzat' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualitzarPuntuacio: async (req, res) => {
    try {
        const puntuacioId = req.params.id;

        if (!comptador) {
            return res.status(400).json({ message: 'El comptador és obligatori.' });
        }
        const puntuacio = await Puntuacio.findById(puntuacioId);
        if (!puntuacio) {
            return res.status(404).json({ message: 'Puntuacio no trobat' });
        }
        puntuacio.puntuacio = Date.now - puntuacio.dataJoc;
        await puntuacio.save();
        res.status(200).json(puntuacio);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTop5: async (req, res) => {
    try {
        const { nivell } = req.params;

        const top5 = await Puntuacio.find({ nivell })
        .sort({ puntuacio: -1 })
        .limit(5);
        res.status(200).json(top5);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    },


  getPuntuacions: async (req, res) => {
    try {
        let filtres = {};

        if (req.query.nivell) {
        filtres.nivell = parseInt(req.query.nivell);
        }
        const Puntuacions = await Puntuacio.find(filtres);
        res.status(200).json(Puntuacions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    },

    getpuntuacioById: async (req, res) => {
        try {
            const puntuacioId = req.params.id;
    
            const puntuacio = await puntuacio.findById(puntuacioId);
            if (!puntuacio) {
                return res.status(404).json({ message: 'Puntuació no trobada' });
            }
            res.status(200).json(puntuacio);
    
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

};

module.exports = PuntuacioController;
