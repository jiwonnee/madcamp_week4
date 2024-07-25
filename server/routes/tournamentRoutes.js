const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  makeTournament,
  getEvents,
  getMatchByRound,
  insertUser,
  getApplications,
  acceptApplication,
  getPlayers,
  getPlayersMoreInfo,
  updatePlayers,
  fetchWins,
  Rounds,
  updateRounds,
  getTournamentInfo,
  newRoundTournament
} = require("../controllers/tournamentController");

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 파일 크기 제한 (예: 5MB)
  },
});

router.post("/create", multerInstance.single("image"), makeTournament);
router.get("/events", getEvents);
router.post("/:id/matches", getMatchByRound);
router.post("/apply", insertUser);
router.get('/:id', getTournamentInfo);
router.get("/:id/applications", getApplications);
router.post("/:id/accept", acceptApplication);
router.get("/:id/players", getPlayers);
router.get("/:id/players_moreInfo", getPlayersMoreInfo);
router.post("/:id/updatePlayers", updatePlayers);
router.post("/fetchWins", fetchWins);
router.get('/:id/rounds', Rounds);
router.post('/:id/updateRounds', updateRounds);
router.put('/:id/increaseRound', newRoundTournament);


module.exports = router;
