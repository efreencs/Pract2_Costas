const mongoose = require('mongoose');

// Definir esquema de préstec
const loanSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  llibre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  dataPrestec: {
    type: Date,
    default: Date.now
  },
  dataRetornaPrevista: {
    type: Date,
    required: true
  },
  dataRetornaReal: {
    type: Date,
    default: null
  },
  estat: {
    type: String,
    enum: ['ACTIU', 'RETORNAT', 'ENDARRERIT'],
    default: 'ACTIU'
  }
});

//  VALIDACIÓ: dataRetornaPrevista ha de ser futura
loanSchema.pre('save', function(next) {
  if (this.dataRetornaPrevista <= this.dataPrestec) {
    next(new Error('La data de devolució ha de ser posterior a la de préstec'));
  } else {
    next();
  }
});

// Crear model
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
