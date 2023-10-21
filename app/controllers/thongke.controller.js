const { Constants } = require("../constants");
const ThongKeService = require("../services/thongke.service");
const kqxsModel = require("../models/kqxs.model");
const { lay10SoBeNhat } = require("../utils");

const layKetQua = async (req, res, next) => {
    const { domain, ngay = new Date(), range = 30 } = req.query;

    const [d, m, y] = ngay.split("-");

    const endDate = new Date(`${m}-${d}-${y}`);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - range);

    if (!domain) {
        res.status(500).json({
            error: "Vui lòng cung cấp miền cần xem kết quả",
        });
        return;
    }

    try {
        const provinces = Object.keys(
            Constants.LichQuayThuong[endDate.getDay()][domain]
        );

        let kqxs = [];

        if (+domain !== +Constants.Domain.MienBac) {
            for (let i = 0; i < provinces.length; i++) {
                const query = {
                    ngay: { $lt: endDate },
                    domain,
                    province: provinces[i],
                };

                const res = await kqxsModel
                    .find(query)
                    .sort({
                        ngay: -1,
                    })
                    .limit(30);
                kqxs = [...kqxs, ...res];
            }
        } else {
            const query = {
                ngay: { $lt: endDate },
                domain,
            };

            const res = await kqxsModel
                .find(query)
                .sort({
                    ngay: -1,
                })
                .limit(30);
            kqxs = [...kqxs, ...res];
        }

        req.kqxs = kqxs;
        req.day = endDate.getDay();

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const xuatHienNhieuNhat = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;

    try {
        const resData = ThongKeService.thongKe10SoXuatHienNhieuNhat(
            kqxs,
            cvHtml
        );

        res.json(resData);
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const xuatHienItNhat = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;
    const numbers = {};

    try {
        kqxs.forEach((e) => {
            const rs = Object.values(e.ketqua)
                .filter(Array.isArray)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });

            rs.forEach((e) => {
                if (numbers[e]) {
                    numbers[e] = numbers[e] + 1;
                } else {
                    numbers[e] = 1;
                }
            });
        });

        const resData = lay10SoBeNhat(numbers);

        if (cvHtml) {
            const html = `
                <table class="table table-bordered">
                    <tbody>
                        ${resData
                            .map((e) => {
                                return `
                                <tr>
                                    <td style="padding: 3px; text-align: center;">
                                        <span class="tk_number font-weight-bold display-block red js-tk-number" data-kyquay="30" data-mientinh="mb">${e[0]}</span>                                    
                                    </td>
                                    <td style="padding: 3px; text-align: center;">
                                        ${e[1]} lần
                                    </td>
                                </tr>
                            `;
                            })
                            .join("")}
                    </tbody>             
                </table>
            `;

            res.json(html);

            return;
        }

        res.json(resData);
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const lauXuatHienNhat = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;

    try {
        const resData = ThongKeService.thongKe10SoLauXuatHienNhat(kqxs, cvHtml);

        res.json(resData);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const chuaXuatHien = async (req, res) => {
    const { kqxs } = req;
    const numbers = {};

    try {
        kqxs.forEach((e) => {
            const rs = e.ketqua.giaidacbiet.map((e) => {
                return e.slice(-2);
            });

            rs.forEach((e) => {
                if (numbers[e]) {
                    numbers[e] = numbers[e] + 1;
                } else {
                    numbers[e] = 1;
                }
            });
        });

        const response = [];

        for (let i = 0; i <= 99; i++) {
            const number = i < 10 ? "0" + i : i;

            if (!numbers[number]) {
                response.push(number);
            }
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const raLienTiep = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;

    try {
        const resData = ThongKeService.thongKe10SoRaLienTiep(kqxs, cvHtml);

        res.json(resData);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const giaiDacBiet = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;

    try {
        const resData = ThongKeService.thongKeGiaiDacBiet(kqxs, cvHtml);

        res.json(resData);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const dauDuoi = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;

    try {
        const resData = ThongKeService.thongKeDauDuoi(kqxs, cvHtml);

        res.json(resData);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const general = async (req, res) => {
    const { kqxs } = req;
    const { ngay, cvHtml, domain } = req.query;
    const day = req.day;
    const labels = {
        1: "XSMB",
        2: "XSMT",
        3: "XSMN",
    };

    if (!cvHtml) {
        res.status(400).json({
            msg: "Close",
        });
        return;
    }

    if (+domain === Constants.Domain.MienBac) {
        const html = `
            <p>10 con số <span style="color: red;">xuất hiện nhiều nhất</span> trong vòng 30 lần quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoXuatHienNhieuNhat(
                kqxs,
                true
            )}
            <p>10 con số <span style="color: red;">lâu xuất hiện nhất</span> trong 30 kỳ quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoLauXuatHienNhat(
                kqxs,
                true
            )}
            <p>10 con số <span style="color: red;">ra liên tiếp</span> trong vòng 30 kỳ quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoRaLienTiep(
                kqxs,
                true
            )}
            <p>Thống kê 30 kỳ quay <span style="color: red;">giải đặc biệt</span> XSMB tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKeGiaiDacBiet(
                kqxs,
                true
            )}            
            <p>Thống kê <span style="color: red;">đầu đuôi</span> trong vòng 30 tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKeDauDuoi(
                kqxs,
                true
            )}            
        `;

        res.json(html);        
    } else {
        const provinces = JSON.parse(
            JSON.stringify(Constants.LichQuayThuong[day][domain])
        );

        kqxs.forEach((kq) => {
            if (provinces[kq.toObject().province]) {
                provinces[kq.toObject().province].push(kq.toObject());
            }
        });

        const html = `
            <h3>Thống kê các tỉnh ${labels[domain]} ngày ${ngay}: ${Object.keys(
            provinces
        )
            .map((e) => e)
            .join(", ")}:</h3>
            ${Object.keys(provinces)
                .map((province) => {
                    return `
                    <p style="color: red;"><b>XS ${province}</b></p>
                    <p class="title mb5">10 con số <span style="color: red;">xuất hiện nhiều nhất</span> trong 30 lần quay, tính đến ngày ${ngay}</p>
                    ${ThongKeService.thongKe10SoXuatHienNhieuNhat(
                        provinces[province],
                        true
                    )}
                    <p class="mt0 mb5">10 con số <span style="color: red;">lâu xuất hiện nhất</span> trong 30 lần quay, tính đến ngày ${ngay}</p>
                    ${ThongKeService.thongKe10SoLauXuatHienNhat(
                        provinces[province],
                        true
                    )}
                    <p class="title">10 con số <span style="color: red;">ra liên tiếp</span> trong vòng 30 lần quay, tính đến ngày ${ngay}</p>
                    ${ThongKeService.thongKe10SoRaLienTiep(
                        provinces[province],
                        true
                    )}
                `;
                })
                .join("")}
        `;

        res.json(html);
    }
};

module.exports = {
    layKetQua,
    lauXuatHienNhat,
    xuatHienNhieuNhat,
    xuatHienItNhat,
    chuaXuatHien,
    raLienTiep,
    giaiDacBiet,
    dauDuoi,
    general,
};
