const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongke.controller");

router.use(thongKeController.layKetQua);

router.get("/xuat-hien-nhieu-nhat", thongKeController.xuatHienNhieuNhat);
router.get("/xuat-hien-it-nhat", thongKeController.xuatHienItNhat);
router.get("/lau-xuat-hien-nhat", thongKeController.lauXuatHienNhat);
router.get("/chua-xuat-hien", thongKeController.chuaXuatHien); // chi tinh giai dac biet
router.get("/ra-lien-tiep", thongKeController.raLienTiep);
router.get("/giai-dac-biet", thongKeController.giaiDacBiet);
router.get("/dau-duoi", thongKeController.dauDuoi);
router.get("/general", thongKeController.general);

module.exports = router;
