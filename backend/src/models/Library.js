const mongoose = require('mongoose');

// Definir esquema de biblioteca
const librarySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  ciutat: {
    type: String,
    required: true,
    trim: true
  },
  adreca: {
    type: String,
    required: true,
    trim: true
  },
  telefon: {
    type: String,
    trim: true
  },
  dataCreacio: {
    type: Date,
    default: Date.now
  }
});

// Crear model
const Library = mongoose.model('Library', librarySchema);

module.exports = Library;
