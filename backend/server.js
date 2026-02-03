const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/routes/UserRoutes');
const bookRoutes = require('./src/routes/BookRoutes');
const loanRoutes = require('./src/routes/LoanRoutes');
const puntuacioRoutes = require('./src/routes/PuntuacioRoutes');
require('dotenv').config();

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

// Rutes 
app.get('/', (req, res) => {
  res.json({ missatge: 'Benvingut a la API de la biblioteca' });
});
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/puntutacions', puntuacioRoutes);



// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
