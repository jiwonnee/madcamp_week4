const db = require("../config/db");

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.query("SELECT * FROM Users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: user[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getUserTournaments = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const [tournaments] = await db.query(
      "SELECT t.* FROM TournamentUser tu JOIN Tournament t ON tu.tournament_id = t.id WHERE tu.user_id = ? && t.isFinished = '0' && t.round_cnt > 0",
      [id]
    );

    res.status(200).json({ tournaments });
  } catch (error) {
    console.error("Error fetching user tournaments:", error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  getUserById,
  getUserTournaments,
};
