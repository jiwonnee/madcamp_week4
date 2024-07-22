const { Storage } = require("@google-cloud/storage");
const db = require("../config/db");

const storage = new Storage();
const bucket = storage.bucket("swiss-round-bucket"); // Google Cloud Storage 버킷 이름

const makeTournament = async (req, res) => {
  const { name, details, startDate, endDate, roundStartDate, roundEndDate, location, maxPeople, createdBy } =
    req.body;
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
          "INSERT INTO Tournament (name, description, start_date, end_date, round_start_date, round_end_date, image_url, location, maxPeople, currentPeople, created_by, isOpened) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            isOpen
          ] // 초기 currentPeople 값을 0으로 설정
        );
        res
          .status(201)
          .json({
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
        "INSERT INTO Tournament (name, description, start_date, end_date, round_start_date, round_end_date, location, maxPeople, currentPeople, created_by, isOpened) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          isOpen
        ] // 초기 currentPeople 값을 0으로 설정
      );
      res
        .status(201)
        .json({
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
  const {round} = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM Matches WHERE round_id = ?", [round]);
    res.status(200).json({ events: rows });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Database error" });
  }
}

const insertUser = async (req, res) => {
  const { tournament_id, user_id } = req.body;

  try {
    // Get the current count of users in the tournament to set player_rank
    const [rankRows] = await db.query(
      'SELECT COUNT(*) AS player_count FROM TournamentUser WHERE tournament_id = ? && state != 0',
      [tournament_id]
    );
    const player_rank = rankRows[0].player_count + 1;

    // Get the number of rounds from the Tournament table to set lose
    const [tournamentRows] = await db.query(
      'SELECT round_cnt FROM Tournament WHERE id = ?',
      [tournament_id]
    );
    const lose = tournamentRows[0]?.round_cnt || 0;

    // Insert the new TournamentUser
    const [result] = await db.query(
      'INSERT INTO TournamentUser (tournament_id, user_id, player_rank, lose) VALUES (?, ?, ?, ?)',
      [tournament_id, user_id, player_rank, lose]
    );

    res.status(201).json({ message: 'Tournament user added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
}

const getApplications = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user_ids from TournamentUser where state is 0
    const [applications] = await db.query(
      'SELECT user_id FROM TournamentUser WHERE tournament_id = ? AND state = \'0\'',
      [id]
    );

    if (applications.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Extract user_ids
    const userIds = applications.map(application => application.user_id);

    console.log(userIds);

    // Fetch user details from Users table
    const [users] = await db.query(
      'SELECT * FROM Users WHERE id IN (?)',
      [userIds]
    );

    res.status(200).json({ users: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  makeTournament,
  getEvents,
  getMatchByRound,
  insertUser,
  getApplications
};
