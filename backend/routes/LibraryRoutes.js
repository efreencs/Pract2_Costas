const express = require('express');
const router = express.Router();
const LibraryController = require('../controllers/LibraryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, LibraryController.createLibrary);
router.get('/', LibraryController.getAllLibraries);
router.get('/:id', LibraryController.getLibraryById);
router.put('/:id', authMiddleware, adminMiddleware, LibraryController.updateLibrary);
router.delete('/:id', authMiddleware, adminMiddleware, LibraryController.deleteLibrary);
router.get('/city/:ciutat', LibraryController.getLibrariesByCity);
router.get('/search', LibraryController.searchLibraries);
module.exports = router;
