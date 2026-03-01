const express = require("express");
const db = require("../config/db");
const entry = require("../controllers/entry");
const downloadEntry = require("../controllers/downloadEntry");
const router = express.Router();
const admin = require("../controllers/admin");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const uploadController = require("../controllers/upload");


/* Upload Student Excel */
router.post("/upload-students", upload.single("file"), uploadController.uploadStudents);


/* Download Entry Excel */
router.get("/download-entry", downloadEntry.downloadEntry);


/* Home Page */
router.get("/home", (req, res) => {
  res.json({ name: "Machine Learning" });
});


/* Register Entry */
router.post("/register", entry.enrtry);

/* Admin Dashboard */
router.get("/admin-dashboard", admin.getDashboard);

module.exports = router;