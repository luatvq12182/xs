const express = require("express");
const router = express.Router();
const aTrungRoiController = require("../controllers/atrungroi.controller");

router.get("/xs", aTrungRoiController.xs);
// router.post("/", aTrungRoiController.createResult);

module.exports = router;
