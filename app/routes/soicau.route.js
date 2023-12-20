const express = require("express");
const router = express.Router();
const soiCauController = require("../controllers/soicau.controller");

router.get("/loto", soiCauController.loto);

module.exports = router;
