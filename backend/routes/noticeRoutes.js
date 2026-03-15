const express = require("express");
const router = express.Router();

const { createNotice, getNotices } = require("../controllers/noticeControllers");

router.post("/create", createNotice);
router.get("/", getNotices);

module.exports = router;