const mongoose = require('mongoose');

// Definir esquema de llibre
const puntuacioSchema = new mongoose.Schema({
    nom_usuari: {
    type: String,
    required: true,
    trim: true
  },
    puntuacio: {
    type: Date,
    default: Date.now,
    required: true,
    trim: true
  },
    comptador: {
    type: Number,
    required: true,
    Default:5
  },
  nivell: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  dataJoc: {
    type: Date,
    default: Date.now
  }
});


// Crear model
const puntuacio = mongoose.model('puntuacio', puntuacioSchema);

module.exports = puntuacio;
