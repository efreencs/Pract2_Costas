const Puntuacio = require('../models/Puntuacio');

const PuntuacioController = {
  create: async (req, res) => {
    try {
      const { nom, nivell, dataInici, dataFinal } = req.body;

      if (!nom || !nivell || !dataInici || !dataFinal) {
        return res.status(400).json({ message: 'Falten camps obligatoris' });
      }

      const temps = Math.floor(
        (new Date(dataFinal) - new Date(dataInici)) / 1000
      );

      const novaPuntuacio = new Puntuacio({
        nom,
        temps,
        nivell,
        dataInici: new Date(dataInici),
        dataFinal: new Date(dataFinal)
      });

      await novaPuntuacio.save();
      res.status(201).json(novaPuntuacio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nom, nivell, dataInici, dataFinal } = req.body;

      if (!nom || !nivell || !dataInici || !dataFinal) {
        return res.status(400).json({ message: 'Falten camps obligatoris' });
      }

      const temps = Math.floor(
        (new Date(dataFinal) - new Date(dataInici)) / 1000
      );

      const puntuacioActualitzada = await Puntuacio.findByIdAndUpdate(
        id,
        {
          nom,
          temps,
          nivell,
          dataInici: new Date(dataInici),
          dataFinal: new Date(dataFinal)
        },
        { new: true }
      );

      if (!puntuacioActualitzada) {
        return res.status(404).json({ message: 'Puntuació no trobada' });
      }

      res.status(200).json(puntuacioActualitzada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTop5: async (req, res) => {
    try {
      const { nivell } = req.params;

      const top5 = await Puntuacio.find({ nivell: parseInt(nivell) })
        .sort({ temps: -1 })
        .limit(5)
        .select('nom temps nivell data');

      res.status(200).json(top5);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PuntuacioController;
