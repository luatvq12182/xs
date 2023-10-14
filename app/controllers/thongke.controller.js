const { Constants } = require("../constants");
const kqxsModel = require("../models/kqxs.model");
const { lay10SoLonNhat, lay10SoBeNhat } = require("../utils");

const layKetQua = async (req, res, next) => {
    const { domain, province, ngay = new Date(), range = 30 } = req.query;

    const [d, m, y] = ngay.split("-");

    const endDate = new Date(`${m}-${d}-${y}`);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - range - 1);

    if (!domain) {
        res.status(500).json({
            error: "Vui lòng cung cấp miền cần xem kết quả",
        });
        return;
    }

    if (+domain !== Constants.Domain.MienBac && !province) {
        res.status(500).json({
            error: "Vui lòng cung cấp tỉnh thành cần xem kết quả",
        });
        return;
    }

    try {
        const query = {
            ngay: { $gte: startDate, $lt: endDate },
            domain,
        };

        if (+domain !== Constants.Domain.MienBac) {
            query.province = province;
        }

        const kqxs = await kqxsModel.find(query).sort({
            ngay: -1,
        });

        req.kqxs = kqxs;

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

        const resData = lay10SoLonNhat(numbers);

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

const xuatHienItNhat = async (req, res) => {
    const { kqxs } = req;
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

        res.json(lay10SoBeNhat(numbers));
    } catch (error) {
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
    const numbers = {};

    try {
        const arr = kqxs.map((e) => {
            return Object.values(e.ketqua)
                .filter(Array.isArray)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });
        });

        for (let i = 0; i <= 99; i++) {
            const num = i < 10 ? "0" + i : "" + i;

            let count = 0;
            let continuously = 0;
            let biggestContinuously = 0;

            arr.forEach((e, index) => {
                e.forEach((numb) => {
                    if (numb === num) {
                        count++;
                    }
                });

                if (e.includes(num) && (arr[index - 1] || []).includes(num)) {
                    continuously = continuously + 1;
                } else {
                    continuously = 1;
                }

                if (continuously > biggestContinuously) {
                    biggestContinuously = continuously;
                }
            });

            numbers[num] = [biggestContinuously, count];
        }

        const resData = Object.entries(numbers)
            .sort((a, b) => b[1][0] - a[1][0])
            .slice(0, 10);

        if (cvHtml) {
            const bigArray = [...resData];

            const arrayOfArrays = bigArray.reduce((acc, el, index) => {
                const subArrayIndex = Math.floor(index / 5);
                if (!acc[subArrayIndex]) {
                    acc[subArrayIndex] = [];
                }
                acc[subArrayIndex].push(el);
                return acc;
            }, []);

            const html = `
                <table class="table table-bordered">
                    <tbody>
                        ${arrayOfArrays.map((subArr) => {
                            return `
                                <tr>
                                    ${subArr.map((e) => {
                                        return `
                                            <td style="text-align: center;">
                                                <span class="tk_number font-weight-bold display-block red js-tk-number" style="display: block; line-height: 20px;" data-kyquay="30" data-mientinh="mb">${e[0]}</span>
                                                <small style="line-height: 20px;">${e[1][0]} ngày<br style="display: block;">(${e[1][1]} lần)</small>
                                            </td>                                    
                                        `
                                    }).join('')}
                                </tr>
                            `
                        }).join('')}
                    </tbody>
                </table>
            `;

            res.json(html);

            return;
        }

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
            const html = `
                <table class="table table-bordered">
                    <tbody>
                        ${Object.keys(resData).map((e, index) => {
                            return `
                                <tr>
                                    <td ${index > 9 ? 'style="font-size: 1.2rem; color: #00aecd;"' : ''}>
                                        <span class="tk_number font-weight-bold display-block" style="font-size: 1.2rem;">${e}</span>
                                    </td>
                                    <td>${resData[e]} lần</td>
                                </tr>
                            `
                        }).join('')}
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

module.exports = {
    layKetQua,
    xuatHienNhieuNhat,
    xuatHienItNhat,
    chuaXuatHien,
    raLienTiep,
    giaiDacBiet,
    dauDuoi,
};
