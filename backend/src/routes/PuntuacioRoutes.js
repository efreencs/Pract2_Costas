const express = require('express');
const router = express.Router();
const puntuacioController = require('../controllers/PuntuacioController');

router.post('/', puntuacioController.createPuntuacio);
router.get('/filter', puntuacioController.getPuntuacions);
router.post('/:id/comptador', puntuacioController.actualitzarComptador);
router.get('/:id', puntuacioController.getpuntuacioById);
router.get('/:nivell', puntuacioController.getTop5);
router.put('/:id', puntuacioController.actualitzarPuntuacio);


module.exports = router;