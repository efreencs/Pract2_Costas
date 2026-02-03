const express = require('express');
const router = express.Router();
const puntuacioController = require('../controllers/PuntuacioController');

router.post('/', puntuacioController.create);
router.get('/top5/:nivell', puntuacioController.getTop5);
router.put('/:id', puntuacioController.update);

module.exports = router;