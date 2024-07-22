const { Storage } = require('@google-cloud/storage');
const db = require('../config/db');

const storage = new Storage();
const bucket = storage.bucket('swiss-round-bucket'); // Google Cloud Storage 버킷 이름

const makeTournament = async (req, res) => {
  const { name, details, startDate, endDate, location, maxPeople, createdBy } = req.body;
  let imageUrl = null;

  // 이미지 파일이 업로드된 경우 처리
  if (req.file) {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ message: 'Unable to upload image.' });
    });

    blobStream.on('finish', async () => {
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // 이미지 URL과 함께 Tournament 생성
      try {
        const [result] = await db.query(
          "INSERT INTO Tournament (name, description, start_date, end_date, image_url, location, maxPeople, currentPeople, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [name, details, startDate, endDate, imageUrl, location, maxPeople, 0, createdBy] // 초기 currentPeople 값을 0으로 설정
        );
        res.status(201).json({ message: 'Tournament created successfully', tournamentId: result.insertId });
      } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ message: 'Database error' });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    // 이미지 파일이 없는 경우 처리
    try {
      const [result] = await db.query(
        "INSERT INTO Tournament (name, description, start_date, end_date, location, maxPeople, currentPeople, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, details, startDate, endDate, location, maxPeople, 0, createdBy] // 초기 currentPeople 값을 0으로 설정
      );
      res.status(201).json({ message: 'Tournament created successfully', tournamentId: result.insertId });
    } catch (error) {
      console.error('Error creating tournament:', error);
      res.status(500).json({ message: 'Database error' });
    }
  }
};

const getEvents = async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM Tournament");
      res.status(200).json({ events: rows });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Database error' });
    }
  };

module.exports = {
    makeTournament,
    getEvents,
};
