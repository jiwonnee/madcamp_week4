// userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserById, getUserTournaments } = require('../controllers/userController');

router.get('/:id', getUserById);
router.get('/:id/tournaments', getUserTournaments);

module.exports = router;
