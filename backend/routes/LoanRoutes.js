const express = require('express');
const router = express.Router();
const loanController = require('../controllers/LoanController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, loanController.createLoan);
router.post('/:id/return', authMiddleware, loanController.returnLoan);
router.get('/user/:userId', authMiddleware, loanController.getLoansByUser);
router.get('/library/:libraryId', authMiddleware, adminMiddleware, loanController.getLoansByLibrary);
router.get('/:id', authMiddleware, loanController.getLoanById);
router.put('/:id/status', authMiddleware, adminMiddleware, loanController.updateLoanStatus);
router.get('/', authMiddleware, adminMiddleware, loanController.getAllLoans);
router.get('/overdue', authMiddleware, adminMiddleware, loanController.getOverdueLoans);

module.exports = router;