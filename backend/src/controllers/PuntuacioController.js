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
