const mongoose = require('mongoose');

// Definir esquema de puntuació
const puntuacioSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  temps: {
    type: Number,
    required: true
  },
  nivell: {
    type: Number,
    required: true,
    min: 2
  },
  dataInici: {
    type: Date,
    required: true
  },
  dataFinal: {
    type: Date,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});


// Crear model
const puntuacio = mongoose.model('puntuacio', puntuacioSchema);

module.exports = puntuacio;
