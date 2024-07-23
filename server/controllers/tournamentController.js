const { Storage } = require("@google-cloud/storage");
const db = require("../config/db");

const storage = new Storage();
const bucket = storage.bucket("swiss-round-bucket"); // Google Cloud Storage 버킷 이름

const getTournamentInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const [tournament] = await db.query(
      "SELECT * FROM Tournament WHERE id = ?",
      [id]
    );

    if (tournament.length === 0) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.status(200).json(tournament[0]);
  } catch (error) {
    console.error("Error fetching tournament info:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const newRoundTournament = async (req, res) => {
  const { id } = req.params;

  try {
    // round_id를 증가시키는 쿼리
    const [result] = await db.query(
      "UPDATE Tournament SET round_cnt = round_cnt + 1 WHERE id = ?",
      [id]
    );

    // 업데이트 결과 확인
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Round count updated successfully' });
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    console.error('Error updating round count:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

const makeTournament = async (req, res) => {
  const {
    name,
    details,
    startDate,
    endDate,
    roundStartDate,
    roundEndDate,
    location,
    maxPeople,
    createdBy,
  } = req.body;
  let imageUrl = null;
  const isOpen = 1;

  // 이미지 파일이 업로드된 경우 처리
  if (req.file) {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.error(err);
      return res.status(500).json({ message: "Unable to upload image." });
    });

    blobStream.on("finish", async () => {
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // 이미지 URL과 함께 Tournament 생성
      try {
        const [result] = await db.query(
          "INSERT INTO Tournament (name, description, start_date, end_date, round_start_date, round_end_date, image_url, location, maxPeople, currentPeople, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            details,
            startDate,
            endDate,
            roundStartDate,
            roundEndDate,
            imageUrl,
            location,
            maxPeople,
            0,
            createdBy,
          ] // 초기 currentPeople 값을 0으로 설정
        );
        res.status(201).json({
          message: "Tournament created successfully",
          tournamentId: result.insertId,
        });
      } catch (error) {
        console.error("Error creating tournament:", error);
        res.status(500).json({ message: "Database error" });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    // 이미지 파일이 없는 경우 처리
    try {
      const [result] = await db.query(
        "INSERT INTO Tournament (name, description, start_date, end_date, round_start_date, round_end_date, location, maxPeople, currentPeople, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          details,
          startDate,
          endDate,
          roundStartDate,
          roundEndDate,
          location,
          maxPeople,
          0,
          createdBy,
        ] // 초기 currentPeople 값을 0으로 설정
      );
      res.status(201).json({
        message: "Tournament created successfully",
        tournamentId: result.insertId,
      });
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Database error" });
    }
  }
};

const getEvents = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Tournament");
    res.status(200).json({ events: rows });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getMatchByRound = async (req, res) => {
  const { round } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM Matches WHERE round_id = ?", [
      round,
    ]);
    res.status(200).json({ events: rows });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const insertUser = async (req, res) => {
  const { tournament_id, user_id } = req.body;

  try {
    // Get the current count of users in the tournament to set player_rank
    const [rankRows] = await db.query(
      "SELECT COUNT(*) AS player_count FROM TournamentUser WHERE tournament_id = ? && state != 0",
      [tournament_id]
    );
    const player_rank = rankRows[0].player_count + 1;

    // Get the number of rounds from the Tournament table to set lose
    const [tournamentRows] = await db.query(
      "SELECT round_cnt FROM Tournament WHERE id = ?",
      [tournament_id]
    );
    const lose = tournamentRows[0]?.round_cnt || 0;

    // Insert the new TournamentUser
    const [result] = await db.query(
      "INSERT INTO TournamentUser (tournament_id, user_id, player_rank, lose) VALUES (?, ?, ?, ?)",
      [tournament_id, user_id, player_rank, lose]
    );

    res.status(201).json({
      message: "Tournament user added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getApplications = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user_ids from TournamentUser where state is 0
    const [applications] = await db.query(
      "SELECT user_id FROM TournamentUser WHERE tournament_id = ? AND state = '0'",
      [id]
    );

    if (applications.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Extract user_ids
    const userIds = applications.map((application) => application.user_id);

    console.log(userIds);

    // Fetch user details from Users table
    const [users] = await db.query("SELECT * FROM Users WHERE id IN (?)", [
      userIds,
    ]);

    res.status(200).json({ users: users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const acceptApplication = async (req, res) => {
  const { id } = req.params; // tournament_id
  const { user_id } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE TournamentUser SET state = '1' WHERE tournament_id = ? AND user_id = ? AND state = '0'",
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or already accepted" });
    }

    res.status(200).json({ message: "Application accepted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getPlayers = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user_ids from TournamentUser where state is 0
    const [applications] = await db.query(
      "SELECT user_id FROM TournamentUser WHERE tournament_id = ? AND state = '1'",
      [id]
    );

    if (applications.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Extract user_ids
    const userIds = applications.map((application) => application.user_id);

    console.log(userIds);

    // Fetch user details from Users table
    const [users] = await db.query("SELECT * FROM Users WHERE id IN (?)", [
      userIds,
    ]);

    res.status(200).json({ users: users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getPlayersMoreInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const [players] = await db.query(
      `
      SELECT 
      tu.id,
      tu.tournament_id,
      tu.user_id,
      tu.player_rank,
      tu.state,
      tu.win,
      tu.lose,
      tu.score,
      tu.buchholz,
      tu.maxWinStreak,
      tu.winStreakStartRound,
      u.following_userid,
      GROUP_CONCAT(m.player2Id ORDER BY m.round_id) as opponentIds,
      GROUP_CONCAT(m.player1Res ORDER BY m.round_id) as matchResults
    FROM TournamentUser tu
    LEFT JOIN Users u ON tu.user_id = u.id
    LEFT JOIN Matches m ON tu.user_id = m.player1Id OR tu.user_id = m.player2Id
    WHERE tu.tournament_id = ?
    GROUP BY tu.id, tu.tournament_id, tu.user_id, tu.player_rank, tu.state, tu.win, tu.lose, tu.score, tu.buchholz, tu.maxWinStreak, tu.winStreakStartRound, u.following_userid;
    `,
      [id]
    );

    const formattedPlayers = players.map((player) => ({
      ...player,
      opponentId: player.opponentIds
        ? player.opponentIds.split(",").map((id) => parseInt(id))
        : [],
      matchResult: player.matchResults
        ? player.matchResults.split(",").map((score) => parseInt(score))
        : [],
    }));

    res.status(200).json({ players: formattedPlayers });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const updatePlayers = async (req, res) => {
  const { players } = req.body;

  try {
    const updatePromises = players.map(async (player) => {
      await db.query(
        `UPDATE TournamentUser SET
          player_rank = ?,
          state = ?,
          win = ?,
          lose = ?,
          score = ?,
          buchholz = ?,
          maxWinStreak = ?,
          winStreakStartRound = ?
        WHERE user_id = ? AND tournament_id = ?`,
        [
          player.rank,
          player.state,
          player.win,
          player.lose,
          player.score,
          player.buchholz,
          player.maxWinStreak,
          player.winStreakStartRound,
          player.id,
          player.tournament_id,
        ]
      );

      const matchUpdatePromises = player.opponentId.map(
        async (opponentId, index) => {
          if (opponentId !== -1) {
            const user1_id = player.id;
            const user2_id = opponentId;
            const user1_score = player.matchResult[index];
            const user2_score =
              player.matchResult[player.opponentId.indexOf(user1_id)];

            await db.query(
              `INSERT INTO Matches (tournament_id, user1_id, user2_id, user1_score, user2_score)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            user1_score = VALUES(user1_score),
            user2_score = VALUES(user2_score)`,
              [
                player.tournament_id,
                user1_id,
                user2_id,
                user1_score,
                user2_score,
              ]
            );
          }
        }
      );

      await Promise.all(matchUpdatePromises);
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: "Players updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const fetchWins = async (req, res) => {
  const { playerIds } = req.body;

  try {
    const [results] = await db.query(
      "SELECT user_id, win FROM TournamentUser WHERE user_id IN (?)",
      [playerIds]
    );

    const wins = results.reduce((acc, row) => {
      acc[row.user_id] = row.win;
      return acc;
    }, {});

    res.status(200).json({ wins });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const Rounds = async (req, res) => {
  const { id } = req.params;

  try {
    const [rounds] = await db.query(
      `SELECT * FROM Matches WHERE tournament_id = ? ORDER BY round_id, matchNum`,
      [id]
    );

    const groupedRounds = rounds.reduce((acc, match) => {
      if (!acc[match.round_id - 1]) {
        acc[match.round_id - 1] = { round: [], num: match.round_id };
      }
      acc[match.round_id - 1].round.push(match);
      return acc;
    }, []);

    res.status(200).json({ rounds: groupedRounds });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const updateRounds = async (req, res) => {
  const { rounds } = req.body;
  const { id } = req.params;

  console.log(rounds);

  try {
    const updatePromises = rounds.map(async (match) => {
      await db.query(
        `INSERT INTO Matches (tournament_id, round_id, matchNum, player1Id, player2Id, player1Res, player2Res)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          player1Res = VALUES(player1Res),
          player2Res = VALUES(player2Res)`,
        [
          id,
          match.round_id,
          match.matchNum,
          match.player1Id,
          match.player2Id == -1? null : match.player2Id,
          match.player1Res,
          match.player2Res,
        ]
      );
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: "Rounds updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  getTournamentInfo,
  newRoundTournament,
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
};
