const XLSX = require("xlsx");
const db = require("../config/db");

exports.uploadStudents = async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await db.query(
      "INSERT IGNORE INTO student (reg_no, student_name) VALUES (?, ?)",
      [row.reg_no, row.student_name]
    );
  }

  res.json({ message: "Students uploaded successfully" });
};


//  ON DUPLICATE KEY UPDATE student_name = VALUES(student_name)