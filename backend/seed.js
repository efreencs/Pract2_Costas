const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar models
const User = require('./src/models/User');
const Book = require('./src/models/Book');

// Connectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connectat a MongoDB'))
  .catch(err => {
    console.error('Error connectant a MongoDB:', err);
    process.exit(1);
  });

// Dades dels llibres
const books = [
  { titol: 'La Revolució Francesa', autor: 'Simon Schama', any: 1989, isbn: '978-0-394-55948-6', categoria: 'História', copiesDisponibles: 3, descripcion: 'Una narració èpica de la Revolució Francesa' },
  { titol: 'Sapiens', autor: 'Yuval Noah Harari', any: 2014, isbn: '978-0-06-231609-7', categoria: 'Historia', copiesDisponibles: 5, descripcion: 'História breve de la humanitat' },
  { titol: 'Un Nou Univers', autor: 'Alan Lightman', any: 2018, isbn: '978-1-250-23489-2', categoria: 'Ciència', copiesDisponibles: 2, descripcion: 'Exploration de la física moderna' },
  { titol: 'El Codi d\'Aristotle', autor: 'Danielle Steel', any: 2017, isbn: '978-0-385-54335-5', categoria: 'Ficció', copiesDisponibles: 4, descripcion: 'Novel·la de ficció clàssica' },
  { titol: 'Python per a Principiants', autor: 'Bill Lubannovic', any: 2019, isbn: '978-1-491-92666-9', categoria: 'Tecnologia', copiesDisponibles: 6, descripcion: 'Guia completa per aprendre Python' },
  { titol: 'El Hàbit del Succés', autor: 'James Clear', any: 2018, isbn: '978-0-7352-1129-8', categoria: 'Autoayuda', copiesDisponibles: 5, descripcion: 'Com construir bons hàbits' },
  { titol: '1984', autor: 'George Orwell', any: 1949, isbn: '978-0-451-52493-5', categoria: 'Ficció', copiesDisponibles: 3, descripcion: 'Distòpia clàssica de ciència ficció' },
  { titol: 'El Silenci dels Inocents', autor: 'Thomas Harris', any: 1988, isbn: '978-0-312-92757-1', categoria: 'Ficció', copiesDisponibles: 4, descripcion: 'Thriller psicològic fascinant' },
  { titol: 'A Brief History of Time', autor: 'Stephen Hawking', any: 1988, isbn: '978-0-553-38016-3', categoria: 'Ciència', copiesDisponibles: 2, descripcion: 'Explicació de l\'univers' },
  { titol: 'The Lean Startup', autor: 'Eric Ries', any: 2011, isbn: '978-0-307-88789-4', categoria: 'Autoayuda', copiesDisponibles: 3, descripcion: 'Com crear empreses innovadores' },
  { titol: 'JavaScript: El Definición', autor: 'David Flanagan', any: 2020, isbn: '978-1-491-95224-8', categoria: 'Tecnologia', copiesDisponibles: 5, descripcion: 'Referencia completa de JavaScript' },
  { titol: 'Navegants Antics', autor: 'Patrick Leigh Fermor', any: 2013, isbn: '978-0-09-954826-2', categoria: 'Historia', copiesDisponibles: 2, descripcion: 'Viatges pels mares antiguos' },
  { titol: 'La Cullera Argent', autor: 'Margaret Atwood', any: 2019, isbn: '978-0-385-54339-3', categoria: 'Ficció', copiesDisponibles: 4, descripcion: 'Novel·la contemporània' },
  { titol: 'Web Design Secrets', autor: 'Giles Colborne', any: 2018, isbn: '978-1-491-96031-1', categoria: 'Tecnologia', copiesDisponibles: 3, descripcion: 'Secrets del web design modern' },
  { titol: 'Origen', autor: 'Dan Brown', any: 2017, isbn: '978-0-385-53794-2', categoria: 'Ficció', copiesDisponibles: 5, descripcion: 'Thriller de misteri i ciència' },
  { titol: 'La Teoria del Tot', autor: 'Stephen Hawking', any: 2002, isbn: '978-0-451-52533-8', categoria: 'Ciència', copiesDisponibles: 2, descripcion: 'Teoria unifcada de l\'univers' },
  { titol: 'Mindfulness', autor: 'Jon Kabat-Zinn', any: 2013, isbn: '978-0-345-47629-6', categoria: 'Autoayuda', copiesDisponibles: 4, descripcion: 'Pràctica de la consciència plena' },
  { titol: 'Git per a Professionals', autor: 'Scott Chacon', any: 2014, isbn: '978-1-491-92262-3', categoria: 'Tecnologia', copiesDisponibles: 3, descripcion: 'Domina el control de versions' },
  { titol: 'La Meitat Perduda', autor: 'Sharon Olds', any: 2018, isbn: '978-0-385-54347-8', categoria: 'Ficció', copiesDisponibles: 2, descripcion: 'Poesia moderna' },
  { titol: 'Economia per a Tots', autor: 'Paul Krugman', any: 2016, isbn: '978-0-393-24099-3', categoria: 'Historia', copiesDisponibles: 4, descripcion: 'Introducció a l\'economia' },
  { titol: 'CSS Avançat', autor: 'Rachel Andrew', any: 2017, isbn: '978-1-491-93541-8', categoria: 'Tecnologia', copiesDisponibles: 5, descripcion: 'Técniques avançades de CSS' },
  { titol: 'El Petó Somni', autor: 'Nicholas Sparks', any: 2016, isbn: '978-0-449-00342-0', categoria: 'Ficció', copiesDisponibles: 3, descripcion: 'Romance emotiu' },
  { titol: 'Database Design', autor: 'Adrienne Watt', any: 2019, isbn: '978-1-491-96023-6', categoria: 'Tecnologia', copiesDisponibles: 2, descripcion: 'Disseny de bases de dades' },
  { titol: 'La Cambra Secreta', autor: 'J.K. Rowling', any: 1998, isbn: '978-0-439-13959-0', categoria: 'Ficció', copiesDisponibles: 6, descripcion: 'Segona novel·la de Harry Potter' },
  { titol: 'Mobile App Development', autor: 'Jody Bracco', any: 2020, isbn: '978-1-491-96842-3', categoria: 'Tecnologia', copiesDisponibles: 4, descripcion: 'Desenvolupament d\'aplicacions mòbils' },
];

// Funcio para seed
async function seedDatabase() {
  try {
    // Eliminar usuaris i llibres existents
    console.log('Eliminant dades existents...');
    await User.deleteMany({});
    await Book.deleteMany({});

    // Crear usuari admin
    console.log('Creant usuari admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      nom: 'Admin Biblioteca',
      email: 'admin@biblioteca.com',
      contrasenya: hashedPassword,
      rol: 'ADMIN'
    });
    await adminUser.save();
    console.log('Usuari admin creat: admin@biblioteca.com / admin123');

    // Crear usuari normal de prova
    console.log('Creant usuari de prova...');
    const userPassword = await bcrypt.hash('user123', 10);
    const normalUser = new User({
      nom: 'Joan Perez',
      email: 'joan@example.com',
      contrasenya: userPassword,
      rol: 'USER'
    });
    await normalUser.save();
    console.log('Usuari de prova creat: joan@example.com / user123');

    // Crear llibres
    console.log('Creant llibres...');
    for (let i = 0; i < books.length; i++) {
      const book = new Book(books[i]);
      await book.save();
    }
    console.log(`${books.length} llibres creats!`);

    console.log('\nDades inicials creades correctament!');
    console.log('\nCredencials per provar:');
    console.log('ADMIN:');
    console.log('  Email: admin@biblioteca.com');
    console.log('  Password: admin123');
    console.log('\nUSUARI:');
    console.log('  Email: joan@example.com');
    console.log('  Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error creant dades:', error);
    process.exit(1);
  }
}

// Executar seed
seedDatabase();
