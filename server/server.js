const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const app = express();

const port = 3001;
const secretKey = "secret-key"; // 환경 변수에서 JWT 비밀 키를 로드

app.use(cors());
app.use(express.json());

const storage = new Storage();
const bucket = storage.bucket('swiss-round-bucket');

// 멀터 설정
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 파일 크기 제한 (예: 5MB)
  },
});

const db = mysql.createPool({
  host: '34.22.83.24', // Google Cloud SQL 인스턴스 IP
  user: 'madcamp4',    // 데이터베이스 사용자 이름
  password: 'MadCamp_Week4', // 데이터베이스 사용자 비밀번호
  database: 'allrounder' // 사용할 데이터베이스 이름
});

// JWT를 생성하는 함수
const generateToken = (user, rememberMe) => {
  const tokenPayload = { id: user.id, username: user.following_userid };
  const tokenOptions = rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' };
  return jwt.sign(tokenPayload, secretKey, tokenOptions);
};

// 로그인 엔드포인트
app.post("/api/login", async (req, res) => {
  const { username, password, rememberMe } = req.body;
  try {
    const [result] = await db.query(
      "SELECT * FROM Users WHERE following_userid = ? AND following_password = ?",
      [username, password]
    );

    if (result.length == 1) {
      const token = generateToken(result[0], rememberMe);
      res.status(200).json({ message: "Login successful", token, user: result[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Database Error" });
  }
});

// 회원가입 엔드포인트
app.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);
  try {
    const [result] = await db.query(
      "INSERT INTO Users (following_userid, email, following_password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Database Error" });
  }
});

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    try {
      const [result] = await db.query("SELECT * FROM Users WHERE id = ?", [decoded.id]);
      if (result.length == 1) {
        req.user = result[0];
        next();
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Database error:", error);
      res.sendStatus(500);
    }
  });
};

// JWT 검증 엔드포인트
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 보호된 엔드포인트 예제
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send('This is protected data.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// UserInfo.js 정보 띄우는부분 추가
// 사용자 정보 가져오기
app.get('/api/userinfo/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query("SELECT following_userid, email, following_password FROM Users WHERE id = ?", [userId]);
    if (result.length == 1) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database Error" });
  }
});

// 이전 경기 정보 가져오기 (예시)
app.get('/api/previousgames/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query("SELECT * FROM PreviousGames WHERE user_id = ?", [userId]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database Error" });
  }
});
