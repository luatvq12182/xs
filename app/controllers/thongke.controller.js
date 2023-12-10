const { Constants } = require("../constants");
const ThongKeService = require("../services/thongke.service");
const kqxsModel = require("../models/kqxs.model");
const {
    lay10SoBeNhat,
    cvDateToYYYYMMDD,
    generateDateArray,
    countOccurrences,
    generateDateArrayByYearAndMonth,
    generateDateArrayByStartDateEndDate,
} = require("../utils");
const KQXS_CACHE = require("../../config/cache");

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
            <p style="font-weight: bolder;">⭐ 10 con số <span style="color: red;">xuất hiện nhiều nhất</span> trong vòng 30 lần quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoXuatHienNhieuNhat(kqxs, true)}
            <p style="font-weight: bolder;">⭐ 10 con số <span style="color: red;">lâu xuất hiện nhất</span> trong 30 kỳ quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoLauXuatHienNhat(kqxs, true)}
            <p style="font-weight: bolder;">⭐ 10 con số <span style="color: red;">ra liên tiếp</span> trong vòng 30 kỳ quay, tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKe10SoRaLienTiep(kqxs, true)}
            <p style="font-weight: bolder;">⭐ Thống kê 30 kỳ quay <span style="color: red;">giải đặc biệt</span> XSMB tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKeGiaiDacBiet(kqxs, true)}            
            <p style="font-weight: bolder;">⭐ Thống kê <span style="color: red;">đầu đuôi</span> trong vòng 30 tính đến ngày ${ngay}:</p>
            ${ThongKeService.thongKeDauDuoi(kqxs, true)}            
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

const tanSuatLoto = async (req, res) => {
    try {
        let { date, numberOfDays, province, numbersWantToSee } = req.query;

        if (numbersWantToSee) {
            numbersWantToSee = numbersWantToSee.split(",");
        } else {
            numbersWantToSee = Array.from({ length: 100 }, (_, index) => {
                if (index < 10) {
                    return "0" + index;
                }
                return index;
            });
        }

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = generateDateArray(date, numberOfDays)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {
            dates: [],
        };

        kqxs.forEach((kq, index) => {
            const crDate = new Date(kq.ngay);
            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            numbersWantToSee.forEach((numWTS) => {
                if (!response[numWTS]) {
                    response[numWTS] = [0];
                }

                response[numWTS][index] = countOccurrences(numWTS, nums);
            });

            response.dates.push(
                `${crDate.getDate()}-${
                    crDate.getMonth() + 1
                }-${crDate.getFullYear()}`
            );
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const tanSuatCapLo = async (req, res) => {
    try {
        let { date, numberOfDays, province, setOfNumbers } = req.query;

        setOfNumbers = setOfNumbers.split(",");

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = generateDateArray(date, numberOfDays)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {
            dates: [],
        };

        kqxs.forEach((kq, index) => {
            const crDate = new Date(kq.ngay);
            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            setOfNumbers.forEach((setOfNum) => {
                if (!response[setOfNum]) {
                    response[setOfNum] = [0];
                }

                if (response[setOfNum][index] === undefined) {
                    response[setOfNum] = [...response[setOfNum], 0];
                }

                console.log(setOfNum.split("-"), nums);

                setOfNum.split("-").forEach((numWTS) => {
                    response[setOfNum][index] =
                        response[setOfNum][index] +
                        countOccurrences(numWTS, nums);
                });
            });

            response.dates.push(
                `${crDate.getDate()}-${
                    crDate.getMonth() + 1
                }-${crDate.getFullYear()}`
            );
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const bangDacBietTuan = async (req, res) => {
    try {
        let { date, numberOfDays, province } = req.query;

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = generateDateArray(date, numberOfDays)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {};

        kqxs.forEach((kq) => {
            const crDate = new Date(kq.ngay);

            response[
                `${crDate.getDate()}-${
                    crDate.getMonth() + 1
                }-${crDate.getFullYear()}`
            ] = kq.ketqua.giaidacbiet[0];
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const bangDacBietThang = async (req, res) => {
    try {
        let { startYear, month } = req.query;

        let kqxs = KQXS_CACHE.get()[1];

        const rs = {};

        for (let i = +startYear; i <= new Date().getFullYear(); i++) {
            rs[i] = generateDateArrayByYearAndMonth(i, month)
                .map((e) => {
                    return kqxs[e];
                })
                .filter(Boolean)
                .map((e) => {
                    return e.ketqua.giaidacbiet;
                })
                .flat();
        }

        res.json(rs);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const bangDacBietNam = async (req, res) => {
    try {
        let { year } = req.query;

        let kqxs = KQXS_CACHE.get()[1];

        const rs = {};

        for (let month = 1; month <= 12; month++) {
            rs[month] = generateDateArrayByYearAndMonth(year, month)
                .map((e) => {
                    return kqxs[e];
                })
                .filter(Boolean)
                .map((e) => {
                    return e.ketqua.giaidacbiet;
                })
                .flat();
        }

        res.json(rs);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const chuKyDacBiet = async (req, res) => {
    res.json("OK");
};

const giaiDacBietGan = async (req, res) => {
    res.json("OK");
};

const thongKeDauDuoiLoto = async (req, res) => {
    try {
        const { startDate, endDate, province } = req.query;

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = generateDateArrayByStartDateEndDate(startDate, endDate)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {
            head: {
                dates: [],
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
            },
            tail: {
                dates: [],
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
            },
        };

        kqxs.forEach((kq, index) => {
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;
            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            response.head.dates.push(cvDate);
            response.tail.dates.push(cvDate);

            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((num) => {
                response.head[num][index] = 0;
                response.tail[num][index] = 0;
            });

            nums.forEach((num) => {
                const headNum = num[0];
                const tailNum = num[1];

                response.head[headNum][index] =
                    response.head[headNum][index] + 1;
                response.tail[tailNum][index] =
                    response.tail[tailNum][index] + 1;
            });
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const chuKyMaxDanCungVe = async (req, res) => {
    res.json("OK");
};

const theoTong = async (req, res) => {
    res.json("OK");
};

const tongHop = async (req, res) => {
    res.json("OK");
};

const quanTrong = async (req, res) => {
    res.json("OK");
};

const lotoKep = async (req, res) => {
    res.json("OK");
};

const lanXuatHien = async (req, res) => {
    res.json("OK");
};

const nhanh = async (req, res) => {
    try {
        let { startDate, endDate, province, numbersWantToSee, type } =
            req.query;
        numbersWantToSee = numbersWantToSee.split(",");

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = generateDateArrayByStartDateEndDate(startDate, endDate)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {};

        kqxs.forEach((kq) => {
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;
            const nums =
                type == 0
                    ? Object.values(kq.ketqua)
                          .flat()
                          .slice(1)
                          .map((e) => {
                              if (e) {
                                  return e.slice(-2);
                              }
                          })
                    : Object.values(kq.ketqua.giaidacbiet)
                          .flat()
                          .map((e) => {
                              if (e) {
                                  return e.slice(-2);
                              }
                          });

            nums.forEach((num) => {
                numbersWantToSee.forEach((numWTS) => {
                    if (!response[numWTS]) {
                        response[numWTS] = {
                            lastDate: "",
                            total: 0,
                        };
                    }

                    if (numWTS == num) {
                        response[numWTS] = {
                            lastDate: cvDate,
                            total: response[numWTS].total + 1,
                        };
                    }
                });
            });
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const loKep = async (req, res) => {
    try {
        const { numberOfSpins, province } = req.query;

        let kqxs = KQXS_CACHE.get();

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = Object.values(kqxs).slice(-numberOfSpins);

        const response = {
            "00": {
                times: 0,
                dates: [],
            },
            11: {
                times: 0,
                dates: [],
            },
            22: {
                times: 0,
                dates: [],
            },
            33: {
                times: 0,
                dates: [],
            },
            44: {
                times: 0,
                dates: [],
            },
            55: {
                times: 0,
                dates: [],
            },
            66: {
                times: 0,
                dates: [],
            },
            77: {
                times: 0,
                dates: [],
            },
            88: {
                times: 0,
                dates: [],
            },
            99: {
                times: 0,
                dates: [],
            },
        };

        kqxs.forEach((kq) => {
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;
            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            nums.forEach((num) => {
                if (response[num]) {
                    if (!response[num].dates.includes(cvDate)) {
                        response[num].times = response[num].times + 1;
                        response[num].dates.push(cvDate);
                    }
                }
            });
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const loRoi = async (req, res) => {
    res.json("OK");
};

const loXien = async (req, res) => {
    res.json("OK");
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
    tanSuatLoto,
    tanSuatCapLo,
    bangDacBietTuan,
    bangDacBietThang,
    bangDacBietNam,
    chuKyDacBiet,
    giaiDacBietGan,
    thongKeDauDuoiLoto,
    chuKyMaxDanCungVe,
    theoTong,
    tongHop,
    quanTrong,
    lotoKep,
    lanXuatHien,
    nhanh,
    loKep,
    loRoi,
    loXien,
};
