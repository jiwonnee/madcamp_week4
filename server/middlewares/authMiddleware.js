const jwt = require('jsonwebtoken');
const db = require('../config/db');
const secretKey = 'secret-key';

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

module.exports = authenticateToken;
