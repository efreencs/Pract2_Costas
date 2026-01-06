const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/LibraryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, libraryController.createLibrary);
router.get('/city/:ciutat', libraryController.getLibrariesByCity);
router.get('/search', libraryController.searchLibraries);
router.get('/', libraryController.getAllLibraries);
router.get('/:id', libraryController.getLibraryById);
router.put('/:id', authMiddleware, adminMiddleware, libraryController.updateLibrary);
router.delete('/:id', authMiddleware, adminMiddleware, libraryController.deleteLibrary);

module.exports = router;
