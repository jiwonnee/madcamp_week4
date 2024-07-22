const express = require('express');
const router = express.Router();
const multer = require('multer');
const { makeTournament, getEvents, getMatchByRound, insertUser, getApplications } = require('../controllers/tournamentController');

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 파일 크기 제한 (예: 5MB)
  },
});

router.post('/create', multerInstance.single('image'), makeTournament);
router.get('/events', getEvents);
router.get('/matches', getMatchByRound);
router.post('/apply', insertUser);
router.get('/:id/applications', getApplications);

module.exports = router;