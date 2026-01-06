const express = require('express');
const router = express.Router();
const bookController = require('../controllers/BookController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', authMiddleware, adminMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);
router.get('/search', bookController.searchBooks);
router.get('/category/:categoria', bookController.getBooksByCategory);

module.exports = router;