const { Constants } = require("../constants");
const ThongKeService = require("../services/thongke.service");
const kqxsModel = require("../models/kqxs.model");
const { lay10SoLonNhat, lay10SoBeNhat } = require("../utils");

const layKetQua = async (req, res, next) => {
    const { domain, province, ngay = new Date(), range = 30 } = req.query;

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
        const query = {
            ngay: { $gte: startDate, $lt: endDate },
            domain,
        };

        if (province) {
            query.province = province;
        }

        const kqxs = await kqxsModel.find(query).sort({
            ngay: -1,
        });

        req.kqxs = kqxs;
        req.day = endDate.getDay();

        next();
    } catch (error) {
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

    const resData = kqxs
        .map((e) => {
            const date = new Date(e.toObject().ngay);

            return {
                ngay: `${date.getDate()}/${date.getMonth() + 1}`,
                value: e.toObject().ketqua.giaidacbiet[0],
            };
        })
        .flat();

    if (cvHtml) {
        const bigArray = [...resData];

        const arrayOfArrays = bigArray.reduce((acc, el, index) => {
            const subArrayIndex = Math.floor(index / 3);
            if (!acc[subArrayIndex]) {
                acc[subArrayIndex] = [];
            }
            acc[subArrayIndex].push(el);
            return acc;
        }, []);

        const html = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th style="text-align: center;">Ngày</th>
                        <th style="text-align: center;">
                            <span class="hidden-xs">Giải</span> ĐB
                        </th>
                        <th style="text-align: center;">Ngày</th>
                        <th style="text-align: center;">
                            <span class="hidden-xs">Giải</span> ĐB
                        </th>
                        <th style="text-align: center;">Ngày</th>
                        <th style="text-align: center;">
                            <span class="hidden-xs">Giải</span> ĐB
                        </th>
                    </tr>
                </thead>   
                <tbody>
                    ${arrayOfArrays
                        .map((subArr) => {
                            return `
                            <tr>
                                ${subArr
                                    .map(({ ngay, value }) => {
                                        return `
                                        <td style="text-align: center; font-size: 14px; padding: 3px;">${ngay}</td>
                                        <td style="text-align: center; font-weight: bold; font-size: 14px; padding: 3px;">${value.slice(
                                            0,
                                            -2
                                        )}<span style="font-weight: bold; color: red;">${value.slice(
                                            -2
                                        )}</span></td>
                                    `;
                                    })
                                    .join("")}
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

    try {
        res.json(resData);
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng thử lại",
        });
    }
};

const dauDuoi = async (req, res) => {
    const { kqxs } = req;
    const { cvHtml } = req.query;
    const numbers = {
        "0x": 0,
        "1x": 0,
        "2x": 0,
        "3x": 0,
        "4x": 0,
        "5x": 0,
        "6x": 0,
        "7x": 0,
        "8x": 0,
        "9x": 0,
        x0: 0,
        x1: 0,
        x2: 0,
        x3: 0,
        x4: 0,
        x5: 0,
        x6: 0,
        x7: 0,
        x8: 0,
        x9: 0,
    };

    try {
        const arr = kqxs.map((e) => {
            return Object.values(e.ketqua)
                .filter(Array.isArray)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });
        });

        for (let i = 0; i <= 9; i++) {
            arr.forEach((e) => {
                e.forEach((numb) => {
                    if (numb.startsWith(i)) {
                        numbers[`${i}x`] = numbers[`${i}x`] + 1;
                    }

                    if (numb.endsWith(i)) {
                        numbers[`x${i}`] = numbers[`x${i}`] + 1;
                    }
                });
            });
        }

        const resData = numbers;

        if (cvHtml) {
            const dau = Object.keys(resData).slice(0, 10);
            const duoi = Object.keys(resData).slice(10);

            const html = `
                <table class="table table-bordered">
                    <tbody>
                        ${dau
                            .map((key, index) => {
                                return `
                                <tr>
                                    <td style="text-align: center;">
                                        <span class="tk_number font-weight-bold display-block" style="font-size: 1rem; padding: 3px;">${index}<small>x</small></span>
                                    </td>
                                    <td style="text-align: center;">${
                                        resData[key]
                                    } lần</td>
                                    <td style="text-align: center;">
                                        <span class="tk_number font-weight-bold display-block" style="font-size: 1rem; padding: 3px; color: #00aecd;"><small>x</small>${index}</span>
                                    </td>
                                    <td style="text-align: center;">${
                                        resData[duoi[index]]
                                    } lần</td>
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

    const provinces = Constants.LichQuayThuong[day][domain];

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
                <p>XS ${province}</p>
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
