const kqxsModel = require("../models/kqxs.model");
const { lay10SoLonNhat, lay10SoBeNhat } = require("../utils");

const xuatHienNhieuNhat = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;
    const numbers = {};

    try {
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

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

        res.json(lay10SoLonNhat(numbers));
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

const xuatHienItNhat = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;
    const numbers = {};

    try {
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

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
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

const chuaXuatHien = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;
    const numbers = {};

    try {
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

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

        res.json({ response });
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

const raLienTiep = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;
    const numbers = {};

    try {
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

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

        res.json(
            Object.entries(numbers)
                .sort((a, b) => b[1][0] - a[1][0])
                .slice(0, 10)
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

const giaiDacBiet = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;

    try {
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

        res.json(
            kqxs
                .map((e) => {
                    return e.toObject().ketqua.giaidacbiet;
                })
                .flat()
        );
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

const dauDuoi = async (req, res) => {
    const { date = new Date(), range = 30 } = req.query;
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
        const kqxs = await kqxsModel
            .find({
                ngay: {
                    $lt: new Date(date),
                },
            })
            .limit(range)
            .sort({
                ngay: -1,
            });

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

        res.json(numbers);
    } catch (error) {
        res.status(500).json({
            msg: "Có lỗi xảy ra, vui lòng sửa lại",
        });
    }
};

module.exports = {
    xuatHienNhieuNhat,
    xuatHienItNhat,
    chuaXuatHien,
    raLienTiep,
    giaiDacBiet,
    dauDuoi,
};
