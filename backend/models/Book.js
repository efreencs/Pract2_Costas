const mongoose = require('mongoose');

// Definir esquema de llibre
const bookSchema = new mongoose.Schema({
  titol: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  any: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Ficció', 'Ciència', 'História', 'Tecnologia', 'Autoayuda', 'Altres'],
    default: 'Altres'
  },
  quantitatTotal: {
    type: Number,
    required: true,
    min: 1
  },
  quantitatDisponible: {
    type: Number,
    required: true,
    min: 0
  },
  dataCreacio: {
    type: Date,
    default: Date.now
  }
});

//  VALIDACIÓ: quantitatDisponible no pot ser més gran que quantitatTotal
bookSchema.pre('save', function(next) {
  if (this.quantitatDisponible > this.quantitatTotal) {
    next(new Error('La quantitat disponible no pot ser més gran que la total'));
  } else {
    next();
  }
});

// Crear model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
