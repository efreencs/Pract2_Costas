// Importar dependències
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/routes/UserRoutes');
const bookRoutes = require('./src/routes/BookRoutes');
const libraryRoutes = require('./src/routes/LibraryRoutes');
const loanRoutes = require('./src/routes/LoanRoutes');
require('dotenv').config();

// Crear app
const app = express();

// Middleware
app.use(cors());
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
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/libraries', libraryRoutes);
app.use('/api/loans', loanRoutes);



// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
