const express = require('express');
const router = express.Router();
const puntuacioController = require('../controllers/puntuacioController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, puntuacioController.createPuntuacio);
router.get('/filter', puntuacioController.getPuntuacions);
router.get('/category/:categoria', puntuacioController.getpuntuaciosByCategory);
router.get('/', puntuacioController.getAllpuntuacios);
router.get('/:id', puntuacioController.getpuntuacioById);
router.put('/:id', authMiddleware, adminMiddleware, puntuacioController.updatePuntuacio);
router.delete('/:id', authMiddleware, adminMiddleware, puntuacioController.deletepuntuacio);

module.exports = router;