const express = require("express");
const router = express.Router();
const soiCauController = require("../controllers/soicau.controller");

router.get("/loto", soiCauController.loto);
router.get("/loto-theo-thu", soiCauController.lotoTheoThu);
router.get("/loto-2-nhay", soiCauController.lotoHaiNhay);
router.get("/loto-tam-giac", soiCauController.lotoTamGiac);

module.exports = router;
