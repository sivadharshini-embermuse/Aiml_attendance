const db = require("../config/db");

exports.enrtry = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const { regNumber, systemNo } = req.body;

    if (!regNumber || !systemNo) {
      return res
        .status(400)
        .json({ error: "Register number or system number missing" });
    }

    //Get student name
    const [student] = await db.query(
      "SELECT student_name FROM student WHERE reg_no = ?",
      [regNumber]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if open session exists
    const [openEntry] = await db.query(
      `SELECT * FROM entry
       WHERE reg_no = ?
       AND system_no = ?
       AND out_time IS NULL
       LIMIT 1`,
      [regNumber, systemNo]
    );

    console.log("OPEN ENTRY:", openEntry);

    // Current IST time
    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    //CHECK-IN
    if (openEntry.length === 0) {
      await db.query(
        `INSERT INTO entry (reg_no, name, system_no, in_time, Date_)
         VALUES (?, ?, ?, ?, ?)`,
        [
          regNumber,
          student[0].student_name,
          systemNo,
          nowIST,
          nowIST.toISOString().split("T")[0],
        ]
      );

      return res.json({
        name: student[0].student_name,
        status: "Check-in",
        regNumber,
        systemNo,
        totaltime: null,
      });
    }

    //CHECK-OUT
    const inTime = new Date(openEntry[0].in_time);
    const outTime = nowIST;

    const diffMs = outTime - inTime;

    const totalTime = new Date(diffMs).toISOString().substring(11, 19);

    await db.query(
      `UPDATE entry
       SET out_time = ?, total_time = ?
       WHERE id = ?`,
      [outTime, totalTime, openEntry[0].id]
    );

    return res.json({
      name: student[0].student_name,
      status: "Check-out",
      regNumber,
      systemNo,
      totaltime: totalTime,
    });

  } catch (err) {
    console.error("ENTRY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};