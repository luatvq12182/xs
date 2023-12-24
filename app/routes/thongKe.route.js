const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongke.controller");

router.get(
    "/xuat-hien-nhieu-nhat",
    thongKeController.layKetQua,
    thongKeController.xuatHienNhieuNhat
);
router.get(
    "/xuat-hien-it-nhat",
    thongKeController.layKetQua,
    thongKeController.xuatHienItNhat
);
router.get(
    "/lau-xuat-hien-nhat",
    thongKeController.layKetQua,
    thongKeController.lauXuatHienNhat
);
router.get(
    "/chua-xuat-hien",
    thongKeController.layKetQua,
    thongKeController.chuaXuatHien
); // chi tinh giai dac biet
router.get(
    "/ra-lien-tiep",
    thongKeController.layKetQua,
    thongKeController.raLienTiep
);
router.get(
    "/giai-dac-biet",
    thongKeController.layKetQua,
    thongKeController.giaiDacBiet
);
router.get("/dau-duoi", thongKeController.layKetQua, thongKeController.dauDuoi);
router.get("/general", thongKeController.layKetQua, thongKeController.general);

router.get("/cang-loto", thongKeController.cangLoto);
router.get("/tan-suat-loto", thongKeController.tanSuatLoto);
router.get("/tan-suat-cap-lo", thongKeController.tanSuatCapLo);
router.get("/tan-suat-xuat-hien", thongKeController.tanSuatXuatHien);
router.get("/bang-dac-biet-tuan", thongKeController.bangDacBietTuan);
router.get("/bang-dac-biet-thang", thongKeController.bangDacBietThang);
router.get("/bang-dac-biet-nam", thongKeController.bangDacBietNam);
router.get("/chu-ky-dac-biet", thongKeController.chuKyDacBiet);
router.get("/giai-dac-biet-gan", thongKeController.giaiDacBietGan);
router.get("/thong-ke-dau-duoi-loto", thongKeController.thongKeDauDuoiLoto);
router.get("/chu-ky-max-dan-cung-ve", thongKeController.chuKyMaxDanCungVe);
router.get("/theo-tong", thongKeController.theoTong);
router.get("/tong-hop", thongKeController.tongHop);
router.get("/quan-trong", thongKeController.quanTrong);
router.get("/loto-kep", thongKeController.lotoKep);
router.get("/lan-xuat-hien", thongKeController.lanXuatHien);
router.get("/nhanh", thongKeController.nhanh);
router.get("/lo-kep", thongKeController.loKep);
router.get("/lo-roi", thongKeController.loRoi);
router.get("/lo-xien", thongKeController.loXien);
router.get("/de", thongKeController.de);
router.get("/lo-gan", thongKeController.loGan);

module.exports = router;
