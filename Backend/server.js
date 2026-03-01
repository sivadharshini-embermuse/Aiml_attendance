const express = require('express');
const path = require('path');
const cors = require("cors");
const db=require('./config/db')
// const attendanceRoutes = require('./routes/attendance');

const app = express();
app.use(cors({ origin: "https://aiml-lab-attendence-1.onrender.com" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const routes = require("./routes/attendanceRoutes");
app.use('/', routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("AIML Lab Attendance Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

