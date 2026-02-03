const mongoose = require('mongoose');

// Definir esquema de llibre
const PuntuacioSchema = new mongoose.Schema({
    nom_usuari: {
    type: String,
    required: true,
    trim: true
  },
    puntuacio: {
    type: Date,
    required: true,
    trim: true
  },
    comptador: {
    type: Date,
    required: true,
    trim: true
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
