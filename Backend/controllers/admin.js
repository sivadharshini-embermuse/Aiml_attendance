const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {

    const [studentsToday] = await db.query(
      "SELECT COUNT(DISTINCT reg_no) as count FROM entry WHERE Date_ = CURDATE()"
    );

    const [activeStudents] = await db.query(
      "SELECT COUNT(*) as count FROM entry WHERE out_time IS NULL"
    );

    const [totalCheckouts] = await db.query(
      "SELECT COUNT(*) as count FROM entry WHERE out_time IS NOT NULL"
    );

    const [avgTime] = await db.query(
      "SELECT SEC_TO_TIME(AVG(TIME_TO_SEC(total_time))) as avg FROM entry WHERE total_time IS NOT NULL"
    );

    const [topSystems] = await db.query(
       `SELECT system_no, COUNT(*) as system_usage
        FROM entry
        GROUP BY system_no
        ORDER BY system_usage DESC
        LIMIT 5`
    );

    res.json({
      studentsToday: studentsToday[0].count,
      activeStudents: activeStudents[0].count,
      totalCheckouts: totalCheckouts[0].count,
      averageUsage: avgTime[0].avg,
      systems: topSystems
    });

  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Dashboard error" });
  }
};