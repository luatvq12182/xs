const express = require("express");
const router = express.Router();
const aTrungRoiController = require("../controllers/atrungroi.controller");

router.get("/xs", aTrungRoiController.xs);
router.get("/result", aTrungRoiController.result);

module.exports = router;
