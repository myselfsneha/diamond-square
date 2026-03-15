const express = require("express");
const router = express.Router();

const {
  preRegisterVisitor,
  entryVisitor,
  exitVisitor,
  getVisitors
} = require("../controllers/visitorController");

router.post("/preregister", preRegisterVisitor);
router.patch("/entry/:id", entryVisitor);
router.patch("/exit/:id", exitVisitor);
router.get("/", getVisitors);

module.exports = router;