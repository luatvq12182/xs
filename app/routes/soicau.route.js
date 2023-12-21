const express = require("express");
const router = express.Router();
const soiCauController = require("../controllers/soicau.controller");

router.get("/loto", soiCauController.loto);
router.get("/loto-theo-thu", soiCauController.lotoTheoThu);

module.exports = router;
