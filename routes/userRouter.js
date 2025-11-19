const express = require("express");
const router = express.Router();
const multer = require("multer");
const authService = require("../services/auth.js");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // الاحتفاظ بالاسم الأصلي مع حفظ الامتداد
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("national_id_image"),
  authService.register
)
router.post(
  "/login",
  authService.logIn
)

module.exports = router;
