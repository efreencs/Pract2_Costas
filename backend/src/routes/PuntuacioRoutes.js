const express = require('express');
const router = express.Router();
const puntuacioController = require('../controllers/PuntuacioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, puntuacioController.createPuntuacio);
router.get('/filter', puntuacioController.getPuntuacions);
router.post('/comptador', puntuacioController.actualitzarComptador);
router.get('/:id', puntuacioController.getpuntuacioById);
router.put('/:id', authMiddleware, puntuacioController.actualitzarPuntuacio);


module.exports = router;