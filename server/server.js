const express = require('express');
const mysql = require('mysql2/promise'); // promise 지원 MySQL2
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // JSON 요청 파싱

const db = mysql.createPool({
  host: '34.22.83.24', // Google Cloud SQL 인스턴스 IP
  user: 'madcamp4',    // 데이터베이스 사용자 이름
  password: 'MadCamp_Week4',// 데이터베이스 사용자 비밀번호
  database: 'allrounder' // 사용할 데이터베이스 이름
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await db.query(
      "SELECT * FROM Users WHERE following_userid = ? AND following_password = ?",
      [username, password]
    );

    if (result.length == 1) {
      res.status(200).json({ message: "Login successful", user: result[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Database Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});