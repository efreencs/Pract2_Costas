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
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validació email
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

//  MIDDLEWARE: Encriptar contrasenya abans de guardar
userSchema.pre('save', async function(next) {
  // Si la contrasenya ja era encriptada, no fer res
  if (!this.isModified('contrasenya')) {
    return next();
  }

  try {
    // Generar "salt" (component aleatori)
    const salt = await bcrypt.genSalt(10);
    // Encriptar contrasenya amb bcrypt
    this.contrasenya = await bcrypt.hash(this.contrasenya, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//  MÈTODE: Comparar contrasenyes encriptades
userSchema.methods.compararContrasenya = async function(contrasenyaIngresada) {
  return await bcrypt.compare(contrasenyaIngresada, this.contrasenya);
};

// Crear model
const User = mongoose.model('User', userSchema);

module.exports = User;
