const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir esquema d'usuari
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  contrasenya: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  dataRegistre: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('contrasenya')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasenya = await bcrypt.hash(this.contrasenya, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.compararContrasenya = async function(contrasenyaIngresada) {
  return await bcrypt.compare(contrasenyaIngresada, this.contrasenya);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
