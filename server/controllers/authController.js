const db = require('../config/db');
const { generateToken } = require('../utils/tokenUtils');

exports.login = async (req, res) => {
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
};

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
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
};

exports.verify = (req, res) => {
  res.json({ user: req.user });
};
