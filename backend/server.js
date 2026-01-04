// Importar dependències
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Crear app
const app = express();

// Middleware
app.use(express.json());

// Connexió a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connectat a la base de dades MongoDB'))
.catch(err => console.error('Error connectant a la base de dades MongoDB:', err));

// Rutes (les afegeirem més tard)
app.get('/', (req, res) => {
  res.json({ missatge: 'Benvingut a la API de la biblioteca' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
