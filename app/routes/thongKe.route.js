const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongke.controller");

router.get("/xuat-hien-nhieu-nhat", thongKeController.xuatHienNhieuNhat);
router.get("/xuat-hien-it-nhat", thongKeController.xuatHienItNhat);
router.get("/chua-xuat-hien", thongKeController.chuaXuatHien); // chi tinh giai dac biet 
router.get("/ra-lien-tiep", thongKeController.raLienTiep);
router.get("/giai-dac-biet", thongKeController.giaiDacBiet);
router.get("/dau-duoi", thongKeController.dauDuoi);

module.exports = router;
