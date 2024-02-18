const moment = require("moment");
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
    genNumsByTotal,
} = require("../utils");
const CACHE = require("../../config/cache");

const calculateDateDiff = (date1, date2) => {
    const momentDate1 = moment(date1);
    const momentDate2 = moment(date2);
    return momentDate2.diff(momentDate1, "days");
};

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

        let kqxs = CACHE.get("KQXS");

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
            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

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

        let kqxs = CACHE.get("KQXS");

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
            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

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

        let kqxs = CACHE.get("KQXS");

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

        kqxs.reverse().forEach((kq) => {
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

        let kqxs = CACHE.get("KQXS")[1];

        const rs = {};

        for (let i = +startYear; i <= new Date().getFullYear(); i++) {
            rs[i] = generateDateArrayByYearAndMonth(i, month)
                .map((e) => {
                    return kqxs[e];
                })
                // .filter(Boolean)
                .map((e) => {
                    if (!e) {
                        return "";
                    }
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

        let kqxs = CACHE.get("KQXS")[1];

        const rs = {};

        for (let month = 1; month <= 12; month++) {
            rs[month] = generateDateArrayByYearAndMonth(year, month)
                .map((e) => {
                    return kqxs[e];
                })
                // .filter(Boolean)
                .map((e) => {
                    if (!e) {
                        return "";
                    }
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
    try {
        const { province } = req.query;
        let date = new Date();
        date.setDate(date.getDate() + 1);

        let kqxs = CACHE.get("KQXS");
        let count = 30;

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        const response = {
            head: {
                0: {
                    lastReturn: "",
                    gap: 0,
                },
                1: {
                    lastReturn: "",
                    gap: 0,
                },
                2: {
                    lastReturn: "",
                    gap: 0,
                },
                3: {
                    lastReturn: "",
                    gap: 0,
                },
                4: {
                    lastReturn: "",
                    gap: 0,
                },
                5: {
                    lastReturn: "",
                    gap: 0,
                },
                6: {
                    lastReturn: "",
                    gap: 0,
                },
                7: {
                    lastReturn: "",
                    gap: 0,
                },
                8: {
                    lastReturn: "",
                    gap: 0,
                },
                9: {
                    lastReturn: "",
                    gap: 0,
                },
            },
            tail: {
                0: {
                    lastReturn: "",
                    gap: 0,
                },
                1: {
                    lastReturn: "",
                    gap: 0,
                },
                2: {
                    lastReturn: "",
                    gap: 0,
                },
                3: {
                    lastReturn: "",
                    gap: 0,
                },
                4: {
                    lastReturn: "",
                    gap: 0,
                },
                5: {
                    lastReturn: "",
                    gap: 0,
                },
                6: {
                    lastReturn: "",
                    gap: 0,
                },
                7: {
                    lastReturn: "",
                    gap: 0,
                },
                8: {
                    lastReturn: "",
                    gap: 0,
                },
                9: {
                    lastReturn: "",
                    gap: 0,
                },
            },
            total: {
                0: {
                    lastReturn: "",
                    gap: 0,
                },
                1: {
                    lastReturn: "",
                    gap: 0,
                },
                2: {
                    lastReturn: "",
                    gap: 0,
                },
                3: {
                    lastReturn: "",
                    gap: 0,
                },
                4: {
                    lastReturn: "",
                    gap: 0,
                },
                5: {
                    lastReturn: "",
                    gap: 0,
                },
                6: {
                    lastReturn: "",
                    gap: 0,
                },
                7: {
                    lastReturn: "",
                    gap: 0,
                },
                8: {
                    lastReturn: "",
                    gap: 0,
                },
                9: {
                    lastReturn: "",
                    gap: 0,
                },
            },
        };

        for (let i = 0; i < 1500; i++) {
            if (count == 0) break;

            date.setDate(date.getDate() - 1);

            const kq =
                kqxs[
                    cvDateToYYYYMMDD(
                        `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`
                    )
                ];

            if (kq) {
                const giaidacbiet = kq.ketqua.giaidacbiet[0];
                const total2Num =
                    +giaidacbiet.slice(-2)[0] + +giaidacbiet.slice(-2)[1];

                const headNum = giaidacbiet.slice(-2)[0];
                const tailNum = giaidacbiet.slice(-2)[1];
                const totalNum = total2Num > 9 ? total2Num - 10 : total2Num;

                if (!response.head[headNum].lastReturn) {
                    response.head[headNum] = {
                        lastReturn: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        gap: i,
                        max: Constants.MaxGan[province].head[headNum],
                        result: giaidacbiet,
                    };

                    count = count - 1;
                }

                if (!response.tail[tailNum].lastReturn) {
                    response.tail[tailNum] = {
                        lastReturn: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        gap: i,
                        max: Constants.MaxGan[province].tail[tailNum],
                        result: giaidacbiet,
                    };

                    count = count - 1;
                }

                if (!response.total[totalNum].lastReturn) {
                    response.total[totalNum] = {
                        lastReturn: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        gap: i,
                        max: Constants.MaxGan[province].total[totalNum],
                        result: giaidacbiet,
                    };

                    count = count - 1;
                }
            }
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const giaiDacBietGan = async (req, res) => {
    try {
        const { type } = req.query;
        let date = new Date();
        date.setDate(date.getDate() + 1);

        let kqxs = CACHE.get("KQXS")[1];

        let response = {};
        let count = 0;

        switch (type) {
            case "1":
                count = 100;
                for (let i = 0; i < 100; i++) {
                    response[i.toString().padStart(2, "0")] = {
                        lastReturn: "",
                        gap: 0,
                    };
                }

                for (let i = 0; i < 500; i++) {
                    if (count == 0) break;
                    date.setDate(date.getDate() - 1);
                    const kq =
                        kqxs[
                            cvDateToYYYYMMDD(
                                `${date.getDate()}-${
                                    date.getMonth() + 1
                                }-${date.getFullYear()}`
                            )
                        ];

                    if (kq) {
                        const giaidacbiet = kq.ketqua.giaidacbiet[0];
                        let num = giaidacbiet.slice(-2);

                        if (!response[num].lastReturn) {
                            response[num] = {
                                lastReturn: `${date.getDate()}-${
                                    date.getMonth() + 1
                                }-${date.getFullYear()}`,
                                gap: i,
                                max: Constants.MaxGan[1].last2Numbers[num],
                            };

                            count = count - 1;
                        }
                    }
                }
                break;

            case "2":
            case "3":
            case "4":
                count = 10;
                response = {
                    0: {
                        lastReturn: "",
                        gap: 0,
                    },
                    1: {
                        lastReturn: "",
                        gap: 0,
                    },
                    2: {
                        lastReturn: "",
                        gap: 0,
                    },
                    3: {
                        lastReturn: "",
                        gap: 0,
                    },
                    4: {
                        lastReturn: "",
                        gap: 0,
                    },
                    5: {
                        lastReturn: "",
                        gap: 0,
                    },
                    6: {
                        lastReturn: "",
                        gap: 0,
                    },
                    7: {
                        lastReturn: "",
                        gap: 0,
                    },
                    8: {
                        lastReturn: "",
                        gap: 0,
                    },
                    9: {
                        lastReturn: "",
                        gap: 0,
                    },
                };

                for (let i = 0; i < 300; i++) {
                    if (count == 0) break;

                    date.setDate(date.getDate() - 1);

                    const kq =
                        kqxs[
                            cvDateToYYYYMMDD(
                                `${date.getDate()}-${
                                    date.getMonth() + 1
                                }-${date.getFullYear()}`
                            )
                        ];

                    if (kq) {
                        const giaidacbiet = kq.ketqua.giaidacbiet[0];
                        const total2Num =
                            +giaidacbiet.slice(-2)[0] +
                            +giaidacbiet.slice(-2)[1];

                        let num;
                        if (type == "2") num = giaidacbiet.slice(-2)[0];
                        if (type == "3") num = giaidacbiet.slice(-2)[1];
                        if (type == "4")
                            num = total2Num > 9 ? total2Num - 10 : total2Num;

                        if (!response[num].lastReturn) {
                            response[num] = {
                                lastReturn: `${date.getDate()}-${
                                    date.getMonth() + 1
                                }-${date.getFullYear()}`,
                                gap: i,
                                max: Constants.MaxGan[1][
                                    `${
                                        type == "2"
                                            ? "head"
                                            : type == "3"
                                            ? "tail"
                                            : "total"
                                    }`
                                ][num],
                            };

                            count = count - 1;
                        }
                    }
                }
                break;

            default:
                break;
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const thongKeDauDuoiLoto = async (req, res) => {
    try {
        const { startDate, endDate, province } = req.query;

        let kqxs = CACHE.get("KQXS");

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
            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

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
    try {
        const { province, startDate, endDate, total, type } = req.query;
        // type: 1 => tất cả giải, 2 => giải đặc biêt

        let kqxs = CACHE.get("KQXS");

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

        const response = genNumsByTotal(+total);
        kqxs.reverse();

        kqxs.forEach((kq, index) => {
            const crDate = new Date(kq.ngay);
            let nums =
                type == 1
                    ? Object.values(kq.ketqua)
                          .flat()
                          .map((e) => {
                              if (e) {
                                  return e.slice(-2);
                              }
                          })
                    : kq.ketqua.giaidacbiet.map((e) => {
                          if (e) {
                              return e.slice(-2);
                          }
                      });

            if (province == 1 && type != 2) {
                nums = nums.slice(1);
            }

            nums.forEach((num) => {
                if (response[num]) {
                    if (!response[num].lastReturn) {
                        response[num] = {
                            lastReturn: `${crDate.getDate()}-${
                                crDate.getMonth() + 1
                            }-${crDate.getFullYear()}`,
                            totalNumberOfOccurrences: 1,
                            gap: index,
                        };
                    } else {
                        response[num].totalNumberOfOccurrences =
                            response[num].totalNumberOfOccurrences + 1;
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

const tongHop = async (req, res) => {
    try {
        // mode => 1 => tất cả giải 2 => giải đặc biệt
        const { type, province, startDate, endDate, mode } = req.query;

        // 1 => "Thống kê tổng chẵn",
        // 2 => "Thống kê tổng lẻ",
        // 3 => "Thống kê bộ chẵn chẵn",
        // 4 => "Thống kê bộ lẻ lẻ",
        // 5 => "Thống kê bộ chẵn lẻ",
        // 6 => "Thống kê bộ lẻ chẵn",
        // 7 => "Thống kê bộ kép",
        // 8 => "Thống kê bộ sát kép",
        // 9 => "Thống kê theo đầu số",
        // 10 => "Thống kê theo đít số",
        // 11 => "Thống kê 15 số về nhiều nhất",
        // 12 => "Thống kê 15 số về ít nhất"

        let kqxs = CACHE.get("KQXS");

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

        let response = {};

        if (
            ["1", "2", "3", "4", "5", "6", "7", "8", "11", "12"].includes(type)
        ) {
            switch (type) {
                case "1":
                    for (let i = 0; i <= 99; i++) {
                        if (i < 10 && i % 2 == 0) {
                            response[i.toString().padStart(2, "0")] = {};
                        } else {
                            const cvToStr = i.toString();

                            if ((+cvToStr[0] + +cvToStr[1]) % 2 == 0) {
                                response[i] = {};
                            }
                        }
                    }
                    break;
                case "2":
                    for (let i = 0; i <= 99; i++) {
                        if (i < 10 && i % 2 == 1) {
                            response[i.toString().padStart(2, "0")] = {};
                        } else {
                            const cvToStr = i.toString();

                            if ((+cvToStr[0] + +cvToStr[1]) % 2 == 1) {
                                response[i] = {};
                            }
                        }
                    }
                    break;
                case "3":
                    for (let i = 0; i <= 99; i++) {
                        if (i < 10 && i % 2 == 0) {
                            response[i.toString().padStart(2, "0")] = {};
                        } else {
                            const cvToStr = i.toString();

                            if (+cvToStr[0] % 2 == 0 && +cvToStr[1] % 2 == 0) {
                                response[i] = {};
                            }
                        }
                    }
                    break;
                case "4":
                    for (let i = 0; i <= 99; i++) {
                        if (i < 10 && i % 2 == 1) {
                            response[i.toString().padStart(2, "0")] = {};
                        } else {
                            const cvToStr = i.toString();

                            if (+cvToStr[0] % 2 == 1 && +cvToStr[1] % 2 == 1) {
                                response[i] = {};
                            }
                        }
                    }
                    break;
                case "5":
                    for (let i = 0; i <= 99; i++) {
                        if (i < 10 && i % 2 == 1) {
                            response[i.toString().padStart(2, "0")] = {};
                        } else {
                            const cvToStr = i.toString();

                            if (+cvToStr[0] % 2 == 0 && +cvToStr[1] % 2 == 1) {
                                response[i] = {};
                            }
                        }
                    }
                    break;
                case "6":
                    for (let i = 10; i <= 99; i++) {
                        const cvToStr = i.toString();

                        if (+cvToStr[0] % 2 == 1 && +cvToStr[1] % 2 == 0) {
                            response[i] = {};
                        }
                    }
                    break;
                case "7":
                    response["00"] = {};
                    for (let i = 10; i <= 99; i++) {
                        if (i % 11 == 0) {
                            response[i] = {};
                        }
                    }
                    break;
                case "8":
                    response["01"] = {};
                    for (let i = 10; i <= 99; i++) {
                        if (i % 11 == 1 || i % 11 == 10) {
                            response[i] = {};
                        }
                    }
                    break;
                case "11":
                    for (let i = 0; i <= 99; i++) {
                        response[i.toString().padStart(2, "0")] = {};
                    }
                    break;
                case "12":
                    for (let i = 0; i <= 99; i++) {
                        response[i.toString().padStart(2, "0")] = {};
                    }
                    break;
                default:
                    break;
            }

            kqxs.reverse();

            kqxs.forEach((kq, index) => {
                const crDate = new Date(kq.ngay);
                let nums =
                    mode == 1
                        ? Object.values(kq.ketqua)
                              .flat()
                              .map((e) => {
                                  if (e) {
                                      return e.slice(-2);
                                  }
                              })
                        : kq.ketqua.giaidacbiet.map((e) => {
                              if (e) {
                                  return e.slice(-2);
                              }
                          });

                if (province == 1 && mode != 2) {
                    nums = nums.slice(1);
                }

                nums.forEach((num) => {
                    if (response[num]) {
                        if (!response[num].lastReturn) {
                            response[num] = {
                                lastReturn: `${crDate.getDate()}-${
                                    crDate.getMonth() + 1
                                }-${crDate.getFullYear()}`,
                                totalNumberOfOccurrences: 1,
                                gap: index,
                            };
                        } else {
                            response[num].totalNumberOfOccurrences =
                                response[num].totalNumberOfOccurrences + 1;
                        }
                    }
                });
            });

            if (type == "11") {
                const keyValueArray = Object.entries(response);
                const sortedArray = keyValueArray.sort(
                    (a, b) =>
                        b[1].totalNumberOfOccurrences -
                        a[1].totalNumberOfOccurrences
                );
                response = sortedArray.slice(0, 15).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            } else if (type == "12") {
                const keyValueArray = Object.entries(response);
                const sortedArray = keyValueArray.sort(
                    (a, b) =>
                        a[1].totalNumberOfOccurrences -
                        b[1].totalNumberOfOccurrences
                );
                response = sortedArray.slice(0, 15).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            } else {
                response = Object.entries(response).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            }
        } else {
            switch (type) {
                case "9":
                    kqxs.reverse();

                    kqxs.forEach((kq, index) => {
                        const crDate = new Date(kq.ngay);
                        let nums =
                            mode == 1
                                ? Object.values(kq.ketqua)
                                      .flat()
                                      .map((e) => {
                                          if (e) {
                                              return e.slice(-2);
                                          }
                                      })
                                : kq.ketqua.giaidacbiet.map((e) => {
                                      if (e) {
                                          return e.slice(-2);
                                      }
                                  });

                        if (province == 1 && mode != 2) {
                            nums = nums.slice(1);
                        }

                        nums.forEach((num) => {
                            const headNum = num[0];

                            if (!response[headNum]) response[headNum] = {};

                            if (!response[headNum].lastReturn) {
                                response[headNum] = {
                                    lastReturn: `${crDate.getDate()}-${
                                        crDate.getMonth() + 1
                                    }-${crDate.getFullYear()}`,
                                    totalNumberOfOccurrences: 1,
                                    gap: index,
                                };
                            } else {
                                response[headNum].totalNumberOfOccurrences =
                                    response[headNum].totalNumberOfOccurrences +
                                    1;
                            }
                        });
                    });
                    break;

                case "10":
                    kqxs.reverse();

                    kqxs.forEach((kq, index) => {
                        const crDate = new Date(kq.ngay);
                        let nums =
                            mode == 1
                                ? Object.values(kq.ketqua)
                                      .flat()
                                      .map((e) => {
                                          if (e) {
                                              return e.slice(-2);
                                          }
                                      })
                                : kq.ketqua.giaidacbiet.map((e) => {
                                      if (e) {
                                          return e.slice(-2);
                                      }
                                  });

                        if (province == 1 && mode != 2) {
                            nums = nums.slice(1);
                        }

                        nums.forEach((num) => {
                            const tailNum = num[1];

                            if (!response[tailNum]) response[tailNum] = {};

                            if (!response[tailNum].lastReturn) {
                                response[tailNum] = {
                                    lastReturn: `${crDate.getDate()}-${
                                        crDate.getMonth() + 1
                                    }-${crDate.getFullYear()}`,
                                    totalNumberOfOccurrences: 1,
                                    gap: index,
                                };
                            } else {
                                response[tailNum].totalNumberOfOccurrences =
                                    response[tailNum].totalNumberOfOccurrences +
                                    1;
                            }
                        });
                    });
                    break;

                default:
                    break;
            }

            response = Object.entries(response).map((e) => {
                return {
                    number: e[0],
                    ...e[1],
                };
            });
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const quanTrong = async (req, res) => {
    try {
        const { type, province } = req.query;
        const date = new Date();
        date.setDate(date.getDate() - 1);

        let kqxs = CACHE.get("KQXS");

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        let response = {};

        kqxs = Object.values(kqxs).slice(-30);

        if (["1", "2", "3"].includes(type)) {
            kqxs.reverse();
            kqxs.forEach((kq, i) => {
                let nums = Object.values(kq.ketqua)
                    .flat()
                    .map((e) => {
                        if (e) {
                            return e.slice(-2);
                        }
                    });
                const date = new Date(kq.ngay);

                if (province == 1) {
                    nums = nums.slice(1);
                }

                nums.forEach((num) => {
                    if (!response[num]) response[num] = {};

                    if (!response[num].lastReturn) {
                        response[num] = {
                            lastReturn: `${date.getDate()}-${
                                date.getMonth() + 1
                            }-${date.getFullYear()}`,
                            totalNumberOfOccurrences: 1,
                            gap: i,
                        };
                    } else {
                        response[num].totalNumberOfOccurrences =
                            response[num].totalNumberOfOccurrences + 1;
                    }
                });
            });

            if (type == "1") {
                const keyValueArray = Object.entries(response);
                const sortedArray = keyValueArray.sort(
                    (a, b) =>
                        b[1].totalNumberOfOccurrences -
                        a[1].totalNumberOfOccurrences
                );
                response = sortedArray.slice(0, 27).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            }

            if (type == "2") {
                const keyValueArray = Object.entries(response);
                const arr = keyValueArray
                    .sort((a, b) => b[1].gap - a[1].gap)
                    .filter((e) => e[1].gap >= 10);
                response = arr.slice(0, 10).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            }

            if (type == "3") {
                const keyValueArray = Object.entries(response);
                const sortedArray = keyValueArray.sort(
                    (a, b) =>
                        a[1].totalNumberOfOccurrences -
                        b[1].totalNumberOfOccurrences
                );
                response = sortedArray.slice(0, 10).map((e) => {
                    return {
                        number: e[0],
                        ...e[1],
                    };
                });
            }
        } else {
            kqxs.forEach((kq, i) => {
                let preNums = Object.values(kqxs[i - 1]?.ketqua || {})
                    .flat()
                    .map((e) => {
                        if (e) {
                            return e.slice(-2);
                        }
                    });
                let nums = Object.values(kq.ketqua)
                    .flat()
                    .map((e) => {
                        if (e) {
                            return e.slice(-2);
                        }
                    });
                const date = new Date(kq.ngay);

                if (province == 1) {
                    nums = nums.slice(1);
                    preNums = preNums.slice(1);
                }

                nums.forEach((num) => {
                    if (!response[num]) {
                        response[num] = {
                            totalNumberOfOccurrences: 1,
                        };
                    }

                    response[num].lastReturn = `${date.getDate()}-${
                        date.getMonth() + 1
                    }-${date.getFullYear()}`;
                    response[num].totalNumberOfOccurrences =
                        response[num].totalNumberOfOccurrences + 1;
                });

                Object.keys(response).forEach((key) => {
                    if (nums.includes(key) && preNums.includes(key)) {
                        response[key].numberOfConsecutiveReturnDays =
                            response[key].numberOfConsecutiveReturnDays + 1;
                    } else if (nums.includes(key)) {
                        response[key].numberOfConsecutiveReturnDays = 1;
                    } else {
                        response[key].numberOfConsecutiveReturnDays = 0;
                    }
                });
            });

            const keyValueArray = Object.entries(response);
            const sortedArray = keyValueArray
                .sort(
                    (a, b) =>
                        b[1].numberOfConsecutiveReturnDays -
                        a[1].numberOfConsecutiveReturnDays
                )
                .filter((e) => {
                    return e[1].numberOfConsecutiveReturnDays > 1;
                });
            response = sortedArray.map((e) => {
                return {
                    number: e[0],
                    ...e[1],
                };
            });
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const lotoKep = async (req, res) => {
    res.json("OK");
};

const lanXuatHien = async (req, res) => {
    res.json("OK");
};

const nhanh = async (req, res) => {
    try {
        // type: 1 => tất cả giải, 2 => giải đặc biệt
        let { startDate, endDate, province, numbersWantToSee, type } =
            req.query;
        numbersWantToSee = numbersWantToSee.split(",");

        let kqxs = CACHE.get("KQXS");

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

        kqxs.forEach((kq, i) => {
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;
            let nums =
                type == 1
                    ? Object.values(kq.ketqua)
                          .flat()
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

            if (province == 1 && type == 1) {
                nums = nums.slice(1);
            }

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
                            gap: kqxs.length - i,
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

        let kqxs = CACHE.get("KQXS");

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
            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

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
    try {
        const { numberOfDays } = req.query;

        let kqxs = CACHE.get("KQXS")[1];

        kqxs = Object.values(kqxs).slice(-numberOfDays);

        const response = [];

        for (let i = 0; i < kqxs.length - 1; i++) {
            const kqCrDay = kqxs[i];
            const kqNextDay = kqxs[i + 1];

            const crDay = new Date(kqxs[i].ngay);
            const nextDay = new Date(kqxs[i + 1].ngay);

            const cvDay = `${crDay.getDate()}-${
                crDay.getMonth() + 1
            }-${crDay.getFullYear()}`;
            const cvNextDay = `${nextDay.getDate()}-${
                nextDay.getMonth() + 1
            }-${nextDay.getFullYear()}`;

            let giaidacbiet = kqCrDay.ketqua.giaidacbiet[0].slice(-2);
            let nums = Object.values(kqNextDay.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                })
                .slice(1);

            if (nums.includes(giaidacbiet)) {
                response.push({
                    returnDay: cvDay,
                    nextDay: cvNextDay,
                    numberReturn: giaidacbiet,
                    resultOfNextDay: nums,
                });
            }
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const loXien = async (req, res) => {
    try {
        // type '1' => lô xiên 2 | '2' => lô xiên 3
        const { numberOfSpins, province, type } = req.query;

        const cacheData = CACHE.get(`loxien${numberOfSpins}${province}${type}`);

        if (cacheData) {
            res.json(cacheData);
            return;
        }

        let kqxs = CACHE.get("KQXS");

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = Object.values(kqxs).reverse();

        let response = {};

        const setOfNumbers = {};

        for (let i = 0; i < numberOfSpins; i++) {
            const kq = kqxs[i];
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;

            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

            if (type == "1") {
                for (let j = 0; j < nums.length - 1; j++) {
                    for (let k = 1; k < nums.length; k++) {
                        if (nums[j] == nums[k]) {
                            continue;
                        }

                        const pair = [+nums[j], +nums[k]]
                            .sort()
                            .map((e) => {
                                return e.toString().padStart(2, "0");
                            })
                            .join("-");

                        if (!setOfNumbers[pair]?.dates?.includes(cvDate)) {
                            setOfNumbers[pair] = {
                                numbers: pair,
                                numberOfDays:
                                    (setOfNumbers[pair]?.numberOfDays || 0) + 1,
                                dates: [
                                    ...(setOfNumbers[pair]?.dates || []),
                                    cvDate,
                                ],
                            };
                        }
                    }
                }
            }

            if (type == "2") {
                for (let j = 0; j < nums.length - 2; j++) {
                    for (let k = 1; k < nums.length - 1; k++) {
                        for (let l = 2; l < nums.length; l++) {
                            if (
                                nums[j] == nums[k] ||
                                nums[k] == nums[l] ||
                                nums[j] == nums[l]
                            ) {
                                continue;
                            }

                            const pair = [+nums[j], +nums[k], +nums[l]]
                                .sort()
                                .map((e) => {
                                    return e.toString().padStart(2, "0");
                                })
                                .join("-");

                            if (!setOfNumbers[pair]?.dates?.includes(cvDate)) {
                                setOfNumbers[pair] = {
                                    numbers: pair,
                                    numberOfDays:
                                        (setOfNumbers[pair]?.numberOfDays ||
                                            0) + 1,
                                    dates: [
                                        ...(setOfNumbers[pair]?.dates || []),
                                        cvDate,
                                    ],
                                };
                            }
                        }
                    }
                }
            }
        }

        response = Object.entries(setOfNumbers)
            .filter((e) => {
                return e[1].numberOfDays > 1;
            })
            .sort((a, b) => {
                return b[1].numberOfDays - a[1].numberOfDays;
            })
            .slice(0, 45)
            .map((e) => {
                return e[1];
            });

        res.json(response);

        CACHE.set(`loxien${numberOfSpins}${province}${type}`, response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const de = async (req, res) => {
    const { returnNumber } = req.query;

    const kqxs = Object.values(
        CACHE.get("KQXS")[Constants.Domain.MienBac]
    ).slice(7);

    const response = {
        numbers: {},
        head: {},
        tail: {},
        total: {},
        nextDay: [],
    };

    for (let i = 0; i < kqxs.length - 1; i++) {
        const kqCrDay = kqxs[i];
        const kqNextDay = kqxs[i + 1];

        const crDay = new Date(kqxs[i].ngay);
        const nextDay = new Date(kqxs[i + 1].ngay);

        const cvDay = `${crDay.getDate()}-${
            crDay.getMonth() + 1
        }-${crDay.getFullYear()}`;
        const cvNextDay = `${nextDay.getDate()}-${
            nextDay.getMonth() + 1
        }-${nextDay.getFullYear()}`;

        let crNums = Object.values(kqCrDay.ketqua)
            .flat()
            .slice(1)
            .map((e) => {
                if (e) {
                    return e.slice(-2);
                }
            });
        let nextNums = Object.values(kqNextDay.ketqua)
            .flat()
            .slice(1)
            .map((e) => {
                if (e) {
                    return e.slice(-2);
                }
            });
        let giaiDacBietReturnDay = kqCrDay.ketqua.giaidacbiet[0];
        let giaiDacBietNextDay = kqNextDay.ketqua.giaidacbiet[0];

        if (giaiDacBietReturnDay.slice(-2) == returnNumber) {
            response.numbers[giaiDacBietNextDay.slice(-2)] =
                (response.numbers[giaiDacBietNextDay.slice(-2)] || 0) + 1;
            response.nextDay.push({
                returnDay: cvDay,
                nextDay: cvNextDay,
                specialPrizeTheNextDay: giaiDacBietNextDay,
                specialPrizeTheReturnDay: giaiDacBietReturnDay,
                resultOfNextDay: nextNums,
            });

            crNums.forEach((num) => {
                const total = +num[0] + +num[1];

                response.head[num[0]] = (response.head[num[0]] || 0) + 1;
                response.tail[num[1]] = (response.tail[num[1]] || 0) + 1;
                response.total[total <= 9 ? total : total - 10] =
                    (response.total[total <= 9 ? total : total - 10] || 0) + 1;
            });
        }
    }

    res.json(response);
};

const tanSuatXuatHien = (req, res) => {
    try {
        const { province, numberOfSpins } = req.query;

        let kqxs = CACHE.get("KQXS");

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = Object.values(kqxs).slice(-numberOfSpins);

        const dacbiet = {};
        const loto = {};

        kqxs.forEach((kq) => {
            const giaidacbiet = kq.ketqua.giaidacbiet[0].slice(-2);
            let nums = Object.values(kq.ketqua)
                .flat()
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            if (province == 1) {
                nums = nums.slice(1);
            }

            dacbiet[giaidacbiet] = (dacbiet[giaidacbiet] || 0) + 1;

            nums.forEach((num) => {
                loto[num] = (loto[num] || 0) + 1;
            });
        });

        const arrKetQua = Object.entries(dacbiet).sort((a, b) => {
            return b[1] - a[1];
        });
        const arrLoto = Object.entries(loto).sort((a, b) => {
            return b[1] - a[1];
        });

        let response = {
            most: {
                specialPrize: arrKetQua.slice(0, 10),
                loto: arrLoto.slice(0, 10),
            },
            atLeast: {
                specialPrize: arrKetQua.slice(-10),
                loto: arrLoto.slice(-10),
            },
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const cangLoto = (req, res) => {
    try {
        // type => kiểu soi | 1 => càng sau | 2 => càng dưới
        // mode => kiểu càng | 1 => cuối | 2 => giữa | 3 => đầu
        const { startDate, endDate, type, mode, numberWantToSee } = req.query;

        let kqxs = CACHE.get("KQXS")[Constants.Domain.MienBac];

        kqxs = generateDateArrayByStartDateEndDate(startDate, endDate)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        let response = [];

        for (let i = 0; i < kqxs.length - (type == 1 ? 1 : 7); i++) {
            const kq = kqxs[i];
            const kqTiepTheo = type == 1 ? kqxs[i + 1] : kqxs[i + 7];
            const crDate = new Date(kq.ngay);
            const cvDate = `${crDate.getDate()}-${
                crDate.getMonth() + 1
            }-${crDate.getFullYear()}`;

            const nextDate = new Date(kqTiepTheo.ngay);
            const cvNextDate = `${nextDate.getDate()}-${
                nextDate.getMonth() + 1
            }-${nextDate.getFullYear()}`;

            let cangMuonSoi;

            switch (mode) {
                case "1":
                    cangMuonSoi = kq.ketqua.giaidacbiet[0].slice(-3);
                    break;
                case "2":
                    cangMuonSoi = kq.ketqua.giaidacbiet[0].slice(1, 4);
                    break;
                case "3":
                    cangMuonSoi = kq.ketqua.giaidacbiet[0].slice(0, 3);
                    break;

                default:
                    break;
            }

            if (cangMuonSoi == numberWantToSee) {
                response.push({
                    returnDate: cvDate,
                    specialPrizeReturnDate: kq.ketqua.giaidacbiet[0],
                    nextDate: cvNextDate,
                    specialPrizeNextDate: kqTiepTheo.ketqua.giaidacbiet[0],
                });
            } else {
                continue;
            }
        }

        res.json(response.reverse());
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const thongKeHaiSoCuoiXoSoMienBac = (req, res) => {
    try {
        const { startDate, endDate, type, numberWantToSee } = req;

        const response = {
            special: {},
            all: {},
        };

        res.json(response);
    } catch (error) {
        console.log("Error: ", error?.message);
        res.status(400).json("Error");
    }
};

const loGan = (req, res) => {
    try {
        const { province, numberOfDays } = req.query;

        const response = {};

        const random = (num = 99) => {
            return Math.ceil(Math.random() * num)
                .toString()
                .padStart(2, "0");
        };

        for (let i = 0; i < 10; i++) {
            const num = random();

            if (!response[num]) {
                response[num] = {
                    returnDay: `${random(30)}-${random(12)}-2023`,
                    numberOfDays: Math.ceil(Math.random() * 20),
                    max: Constants.GanCucDai[num],
                };
            }
        }

        res.json(response);
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(400).json("Error");
    }
};

const deKepLech = (req, res) => {
    try {
        const response = [];

        const random = (num = 99) => {
            return Math.ceil(Math.random() * num)
                .toString()
                .padStart(2, "0");
        };

        for (let i = 0; i < 20; i++) {
            let de = random(10000);
            let deHomSau = random(10000);

            while (+de < 10000) {
                de = random(99998);
            }

            while (+deHomSau < 10000) {
                deHomSau = random(99998);
            }

            const loHomSau = [];

            for (let i = 0; i < 27; i++) {
                loHomSau.push(random());
            }

            response.push({
                ngayVe: `${random(30)}-${random(12)}-2023`,
                de: de,
                deHomSau: deHomSau,
                loHomSau: loHomSau,
                homSau: `${random(30)}-${random(12)}-2023`,
            });
        }

        res.json(response);
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(400).json("Error");
    }
};

const deKepAm = (req, res) => {
    try {
        const response = [];

        const random = (num = 99) => {
            return Math.ceil(Math.random() * num)
                .toString()
                .padStart(2, "0");
        };

        for (let i = 0; i < 20; i++) {
            let de = random(10000);
            let deHomSau = random(10000);

            while (+de < 10000) {
                de = random(99998);
            }

            while (+deHomSau < 10000) {
                deHomSau = random(99998);
            }

            const loHomSau = [];

            for (let i = 0; i < 27; i++) {
                loHomSau.push(random());
            }

            response.push({
                ngayVe: `${random(30)}-${random(12)}-2023`,
                de: de,
                deHomSau: deHomSau,
                loHomSau: loHomSau,
                homSau: `${random(30)}-${random(12)}-2023`,
            });
        }

        res.json(response);
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(400).json("Error");
    }
};

const loLoTheoGiai = async (req, res) => {
    try {
        // prize -> 0 -> 27
        let { startDate, endDate, prize } = req.query;

        const numbersWantToSee = Array.from({ length: 100 }, (_, index) => {
            return index.toString().padStart(2, "0");
        });

        let kqxs = CACHE.get("KQXS")[1];

        kqxs = generateDateArrayByStartDateEndDate(startDate, endDate)
            .map((e) => {
                return kqxs[e];
            })
            .filter(Boolean);

        const response = {
            dates: [],
        };

        kqxs.reverse();

        kqxs.forEach((kq, index) => {
            const crDate = new Date(kq.ngay);
            let nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    if (e) {
                        return e.slice(-2);
                    }
                });

            nums = [nums[prize]];

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

const xuatHienNhieuNhatV2 = (req, res) => {
    try {
        // cvHtml = 0 | 1 (true or false)
        const { domain, province, cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[domain][province];

        kqxs = Object.values(kqxs).slice(-30);

        const numbers = {};

        kqxs.forEach((e) => {
            const date = new Date(e.ngay);

            const rs = Object.values(e.ketqua)
                .filter(Array.isArray)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });

            rs.forEach((e) => {
                if (numbers[e]) {
                    numbers[e] = {
                        theNumberOfOccurrences:
                            numbers[e].theNumberOfOccurrences + 1,
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                    };
                } else {
                    numbers[e] = {
                        theNumberOfOccurrences: 1,
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                    };
                }
            });
        });

        const arr = Object.entries(numbers);

        arr.sort(
            (a, b) => b[1].theNumberOfOccurrences - a[1].theNumberOfOccurrences
        );

        const top10 = arr.slice(0, 10).map((e) => {
            return {
                num: e[0],
                ...e[1],
            };
        });

        if (cvHtml) {
            let html = `
                <div class="thong-ke-xuat-hien-nhieu-nhat">
                    <table>
                        <thead>
                            <tr>
                                <th colspan="4" class="table-main-title">Thống kê Loto xuất hiện nhiều nhất</th>
                            </tr>
                            <tr>
                                <th>Loto</th>
                                <th>Xuất hiện</th>
                                <th>Ngày về gần nhất</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${top10
                                .map(
                                    ({
                                        num,
                                        theNumberOfOccurrences,
                                        lastReturnDate,
                                    }) => {
                                        return `
                                <tr>
                                    <td>${num}</td>
                                    <td>${theNumberOfOccurrences} lượt</td>
                                    <td>${lastReturnDate}</td>
                                </tr>
                                `;
                                    }
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `;

            res.json(html);
        } else {
            res.json(top10);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const xuatHienItNhatV2 = (req, res) => {
    try {
        // cvHtml = 0 | 1 (true or false)
        const { domain, province, cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[domain][province];

        kqxs = Object.values(kqxs).slice(-30);

        const numbers = {};

        kqxs.forEach((e) => {
            const date = new Date(e.ngay);

            const rs = Object.values(e.ketqua)
                .filter(Array.isArray)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });

            rs.forEach((e) => {
                if (numbers[e]) {
                    numbers[e] = {
                        theNumberOfOccurrences:
                            numbers[e].theNumberOfOccurrences + 1,
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                    };
                } else {
                    numbers[e] = {
                        theNumberOfOccurrences: 1,
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                    };
                }
            });
        });

        const arr = Object.entries(numbers);

        arr.sort(
            (a, b) => a[1].theNumberOfOccurrences - b[1].theNumberOfOccurrences
        );

        const top10 = arr.slice(0, 10).map((e) => {
            return {
                num: e[0],
                ...e[1],
            };
        });

        if (cvHtml) {
            let html = `
                <div class="thong-ke-xuat-hien-it-nhat">
                    <table>
                        <thead>
                            <tr>
                                <th colspan="4" class="table-main-title">Thống kê loto xuất hiện ít nhất</th>
                            </tr>
                            <tr>
                                <th>Loto</th>
                                <th>Xuất hiện</th>
                                <th>Ngày về gần nhất</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${top10
                                .map(
                                    ({
                                        num,
                                        theNumberOfOccurrences,
                                        lastReturnDate,
                                    }) => {
                                        return `
                                        <tr>
                                            <td>${num}</td>
                                            <td>${theNumberOfOccurrences} lượt</td>
                                            <td>${lastReturnDate}</td>
                                        </tr>
                                    `;
                                    }
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `;

            res.json(html);
        } else {
            res.json(top10);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const thongKeGanGiaiDacBiet = (req, res) => {
    try {
        const { domain, province, cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[domain][province];

        kqxs = Object.values(kqxs);

        const numbers = {};

        kqxs.forEach((e) => {
            const date = new Date(e.ngay);

            const rs = e.ketqua.giaidacbiet.map((num) => {
                return num.slice(-2);
            });

            rs.forEach((e) => {
                if (numbers[e]) {
                    numbers[e] = {
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        returnDates: [...numbers[e].returnDates, date],
                        range:
                            numbers[e].returnDates.length > 0
                                ? [
                                      ...numbers[e].range,
                                      calculateDateDiff(
                                          numbers[e].returnDates[
                                              numbers[e].returnDates.length - 1
                                          ],
                                          date
                                      ),
                                  ]
                                : [],
                        times: calculateDateDiff(date, new Date()),
                    };
                } else {
                    numbers[e] = {
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        returnDates: [date],
                        range: [],
                        times: calculateDateDiff(date, new Date()),
                    };
                }
            });
        });

        const arr = Object.entries(numbers);

        arr.sort((a, b) => b[1].times - a[1].times);

        const top10 = arr
            .slice(0, 10)
            .map((e) => {
                return {
                    num: e[0],
                    ...e[1],
                };
            })
            .map((e) => {
                return {
                    ...e,
                    max: e.range.length > 0 ? Math.max(...e.range) : e.times,
                };
            });

        if (cvHtml) {
            let html = `
                <div class="thong-ke-xuat-hien-it-nhat">
                    <table>
                        <thead>
                            <tr>
                                <th colspan="4" class="table-main-title">Thống kê gan giải đặc biệt</th>
                            </tr>
                            <tr>
                                <th>Lô gan</th>
                                <th>Lần chưa về</th>
                                <th>Về gần nhất</th>
                                <th>Lô gan cực đại</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${top10
                                .map(({ num, times, lastReturnDate, max }) => {
                                    return `
                                        <tr>
                                            <td>${num}</td>
                                            <td>${times} lần</td>
                                            <td>${lastReturnDate}</td>
                                            <td>${max} lần</td>
                                        </tr>
                                    `;
                                })
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `;

            res.json(html);
        } else {
            res.json(top10);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const thongKeTongGiaiDacBiet = (req, res) => {
    try {
        const { domain, province, cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[domain][province];

        kqxs = Object.values(kqxs);

        const numbers = {};

        kqxs.forEach((e) => {
            const date = new Date(e.ngay);

            const rs = e.ketqua.giaidacbiet.map((num) => {
                return num.slice(-2);
            });

            rs.forEach((e) => {
                let total = +e[0] + +e[1];
                total = total < 10 ? total : total - 10;

                if (numbers[total]) {
                    numbers[total] = {
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        returnDates: [...numbers[total].returnDates, date],
                        range:
                            numbers[total].returnDates.length > 0
                                ? [
                                      ...numbers[total].range,
                                      calculateDateDiff(
                                          numbers[total].returnDates[
                                              numbers[total].returnDates
                                                  .length - 1
                                          ],
                                          date
                                      ),
                                  ]
                                : [],
                        times: calculateDateDiff(date, new Date()),
                    };
                } else {
                    numbers[total] = {
                        lastReturnDate: `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`,
                        returnDates: [date],
                        range: [],
                        times: calculateDateDiff(date, new Date()),
                    };
                }
            });
        });

        const arr = Object.entries(numbers);

        arr.sort((a, b) => b[1].times - a[1].times);

        const top10 = arr
            .slice(0, 10)
            .map((e) => {
                return {
                    num: e[0],
                    ...e[1],
                };
            })
            .map((e) => {
                return {
                    ...e,
                    max: e.range.length > 0 ? Math.max(...e.range) : e.times,
                };
            });

        if (cvHtml) {
            let html = `
                <div class="thong-ke-xuat-hien-it-nhat">
                    <table>
                        <thead>
                            <tr>
                                <th colspan="4" class="table-main-title">Thống kê tổng giải đặc biệt</th>
                            </tr>
                            <tr>
                                <th>Tổng số</th>
                                <th>Lần chưa về</th>
                                <th>Về gần nhất</th>
                                <th>Lô gan cực</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${top10
                                .map(({ num, times, lastReturnDate, max }) => {
                                    return `
                                        <tr>
                                            <td>${num}</td>
                                            <td>${times} lần</td>
                                            <td>${lastReturnDate}</td>
                                            <td>${max} lần</td>
                                        </tr>
                                    `;
                                })
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `;

            res.json(html);
        } else {
            res.json(
                top10.map((e) => {
                    return {
                        ...e,
                        returnDates: [],
                        range: [],
                    };
                })
            );
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const rbkThongKeXSMBTongHop = (req, res) => {
    try {
        const { cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[1];
        kqxs = Object.values(kqxs)
            .filter((e) => !Array.isArray(e))
            .reverse()
            .slice(0, 40);

        let appear = {};
        let loroi = {};
        let head = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
        };
        let tail = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
        };

        for (let i = 0; i < kqxs.length; i++) {
            const kq = kqxs[i];
            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((num) => {
                    return num.slice(-2);
                });

            nums.forEach((num) => {
                if (i === 0) {
                    loroi[num] = 1;
                } else {
                    if (loroi[num] && i === loroi[num]) {
                        loroi[num] = loroi[num] + 1;
                    }
                }

                if (appear[num]) {
                    appear[num].appear = appear[num].appear + 1;
                } else {
                    appear[num] = {
                        appear: 1,
                        numberOfDaysNotReturned: calculateDateDiff(
                            kq.ngay,
                            new Date()
                        ),
                    };
                }

                head[num[0]] = head[num[0]] + 1;
                tail[num[1]] = tail[num[1]] + 1;
            });
        }

        const sortArrByAppear = Object.entries(appear).sort((a, b) => {
            return b[1].appear - a[1].appear;
        });
        const sortArrByDaysNotReturn = Object.entries(appear)
            .sort((a, b) => {
                return (
                    b[1].numberOfDaysNotReturned - a[1].numberOfDaysNotReturned
                );
            })
            .filter((e) => e[1].numberOfDaysNotReturned >= 10);
        const sortArrByLoRoi = Object.entries(loroi)
            .sort((a, b) => {
                return b[1] - a[1];
            })
            .filter((e) => e[1] > 1);

        if (cvHtml) {
            res.json({
                html: `
                <div class="widget-content">
                  <div class="tk-nhanh-item-header">
                    10 bộ số xuất hiện <span class="red">nhiều</span> nhất trong 40 ngày
                    qua
                    </div>
                    <table class="table col100">
                    <tbody>
                        <tr>
                        ${sortArrByAppear
                            .slice(0, 5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].appear} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        <tr>
                        ${sortArrByAppear
                            .slice(5, 10)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].appear} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                    </tbody>
                    </table>
                    <div class="tk-nhanh-item-header">
                    10 bộ số xuất hiện <span class="red">ít</span> nhất trong 40 ngày qua
                    </div>
                    <table class="table col100">
                    <tbody>
                        <tr>
                        ${sortArrByAppear
                            .slice(-5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].appear} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        <tr>
                        ${sortArrByAppear
                            .slice(-10, -5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].appear} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                    </tbody>
                    </table>
                    <div class="tk-nhanh-item-header">
                    Bộ số ra liên tiếp (<span class="red">Lô rơi</span>)
                    </div>
                    <table class="table col100">
                    <tbody>
                        <tr>
                        ${sortArrByLoRoi
                            .slice(0, 5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        ${sortArrByLoRoi.length > 5 ? `<tr>
                        ${sortArrByLoRoi
                            .slice(5, 10)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>` : ''}
                    </tbody>
                    </table>
                    <div class="tk-nhanh-item-header">
                    Bộ số không ra 10 ngày trở lên (<span class="red">Lô khan</span>)
                    </div>
                    <table class="table col100">
                    <tbody>
                        <tr>
                        ${sortArrByDaysNotReturn
                            .slice(0, 5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].numberOfDaysNotReturned} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        <tr>
                        ${sortArrByDaysNotReturn
                            .slice(5, 10)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1].numberOfDaysNotReturned} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                    </tbody>
                    </table>
                    <div class="tk-nhanh-item-header">
                    Thống kê <span class="red"> đầu số </span> xuất hiện trong 40 ngày qua
                    </div>
                    <table class="table col100 tsds-40">
                    <tbody>
                        <tr>
                        ${Object.entries(head)
                            .slice(0, 5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        <tr>
                        ${Object.entries(head)
                            .slice(5, 10)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                    </tbody>
                    </table>
                    <div class="tk-nhanh-item-header">
                    Thống kê <span class="red"> đít số </span>xuất hiện trong 40 ngày qua
                    </div>
                    <table class="table col100 tsds-40">
                    <tbody>
                        <tr>
                        ${Object.entries(tail)
                            .slice(0, 5)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                        <tr>
                        ${Object.entries(tail)
                            .slice(5, 10)
                            .map((e) => {
                                return `
                                <td class="tk-nhanh-number">
                                    <span class="bold">${e[0]}</span>: ${e[1]} lần
                                </td>
                            `;
                            })
                            .join("")}
                        </tr>
                    </tbody>
                    </table>
                </div>                
                `,
            });
        } else {
            res.json({
                most: sortArrByAppear.slice(0, 10),
                atLeast: sortArrByAppear.slice(-10),
                sortArrByDaysNotReturn,
                head: head,
                tail: tail,
                loroi: sortArrByLoRoi,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const rbkThongKeDacBietXSMBLauChuaRa = (req, res) => {
    try {
        const { cvHtml } = req.query;

        let kqxs = CACHE.get("KQXS")[1];

        kqxs = Object.values(kqxs)
            .filter((e) => !Array.isArray(e))
            .reverse();

        const response = {};
        let count = 100;

        for (let i = 0; i < kqxs.length; i++) {
            const kq = kqxs[i];
            const giaidacbiet = kq.ketqua.giaidacbiet[0].slice(-2);

            if (!response[giaidacbiet]) {
                response[giaidacbiet] = calculateDateDiff(kq.ngay, new Date());
                count--;
            }

            if (count === 0) break;
        }

        const sortArr = Object.entries(response).sort((a, b) => {
            return b[1] - a[1];
        });

        if (+cvHtml) {
            res.json({
                html: `
                    <div class="thongke-db">
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(0, 5)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(5, 10)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(10, 15)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(15, 20)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(20, 25)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                        <table class="tbl1" cellspacing="1" cellpadding="4">
                            <tbody>
                                ${sortArr
                                    .slice(25, 30)
                                    .map((e) => {
                                        return `
                                        <tr>
                                            <td class="col1">${e[0]}</td>
                                            <td class="col2">${e[1]}&nbsp;ngày</td>
                                        </tr>                                        
                                    `;
                                    })
                                    .join("")}
                            </tbody>
                        </table>
                    </div>
                `,
            });
        } else {
            res.json(sortArr.slice(0, 30));
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

const rbkThongKeXSMBTheoNgay = (req, res) => {
    try {
        const { cvHtml } = req.query;
        const today = new Date();
        const day = today.getDay();

        const dayLabels = {
            0: "Chủ nhật",
            1: "Thứ hai",
            2: "Thứ ba",
            3: "Thứ tư",
            4: "Thứ năm",
            5: "Thứ sáu",
            6: "Thứ bảy",
        };

        let kqxs = CACHE.get("KQXS")[1];
        kqxs = Object.values(kqxs)
            .slice(-30)
            .filter((e) => {
                const d = new Date(e.ngay);

                return d.getDay() === day;
            });

        const response = Array.from({ length: 100 }, (_, index) => {
            return index.toString().padStart(2, "0");
        }).reduce((pre, cr) => {
            return {
                ...pre,
                [cr]: 0,
            };
        }, {});

        for (let i = 0; i < kqxs.length; i++) {
            const kq = kqxs[i];

            const nums = Object.values(kq.ketqua)
                .flat()
                .slice(1)
                .map((e) => {
                    return e.slice(-2);
                });

            nums.forEach((num) => {
                if (response[num]) {
                    response[num] = response[num] + 1;
                } else {
                    response[num] = 1;
                }
            });
        }

        const sortArr = Object.entries(response).sort((a, b) => {
            return b[1] - a[1];
        });

        if (+cvHtml) {
            res.json({
                html: `
                    <div class="result-table">
                        <table class="table col100">
                            <tbody>
                                <tr><td class="bold">27 bộ số xuất hiện nhiều nhất vào ${
                                    dayLabels[day]
                                } trong 4 tuần:</td></tr>
                                <tr>
                                    <td class="lh22">
                                        ${sortArr
                                            .slice(0, 27)
                                            .map((e) => {
                                                return `<span class="bold red">${e[0]}</span>(${e[1]} lần); `;
                                            })
                                            .join("")}
                                    </td>
                                </tr>
                                <tr><td class="bold">10 bộ số xuất hiện ít nhất vào ${
                                    dayLabels[day]
                                } trong 4 tuần: </td></tr>
                                <tr>
                                    <td class="lh22">
                                        ${sortArr
                                            .slice(-10)
                                            .map((e) => {
                                                return `<span class="bold red">${e[0]}</span>(${e[1]} lần); `;
                                            })
                                            .join("")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>            
                `,
            });
        } else {
            return res.json({
                most: sortArr.slice(0, 27),
                atLeast: sortArr.slice(-10),
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

module.exports = {
    cangLoto,
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
    tanSuatXuatHien,
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
    de,
    thongKeHaiSoCuoiXoSoMienBac,
    loGan,
    deKepLech,
    deKepAm,
    loLoTheoGiai,
    xuatHienNhieuNhatV2,
    xuatHienItNhatV2,
    thongKeGanGiaiDacBiet,
    thongKeTongGiaiDacBiet,
    rbkThongKeXSMBTongHop,
    rbkThongKeDacBietXSMBLauChuaRa,
    rbkThongKeXSMBTheoNgay,
};
