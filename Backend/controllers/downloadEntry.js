const XLSX = require("xlsx-js-style");
const db = require("../config/db");

exports.downloadEntry = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         reg_no,
         name,
         system_no,
         in_time,
         out_time,
         total_time,
         Date_
       FROM entry
       ORDER BY Date_, in_time`
    );

    const formattedRows = [];
    let lastDate = null;

    rows.forEach(row => {
      const currentDate = row.Date_ instanceof Date
        ? row.Date_.toISOString().split("T")[0]
        : row.Date_;

      // 🔹 Insert colored DATE row when date changes
      if (currentDate !== lastDate) {
        formattedRows.push({
          reg_no: `DATE: ${currentDate}`,
          name: "",
          system_no: "",
          in_time: "",
          out_time: "",
          total_time: ""
        });
        lastDate = currentDate;
      }

      formattedRows.push(row);
    });

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // 🔹 Apply style to DATE rows
    Object.keys(worksheet).forEach(cell => {
      if (
        worksheet[cell] &&
        worksheet[cell].v &&
        typeof worksheet[cell].v === "string" &&
        worksheet[cell].v.startsWith("DATE:")
      ) {
        worksheet[cell].s = {
          fill: {
            fgColor: { rgb: "FFD966" } // Yellow color
          },
          font: {
            bold: true
          },
          alignment: {
            horizontal: "center"
          }
        };
      }
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entry");

    // Generate Excel buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=entry.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Failed to download entry data" });
  }
};






