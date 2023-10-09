const KQXSModel = require("../models/kqxs.model");
const { getTimeInVn } = require("../utils");

const getResult = async (req, res) => {
    try {
        const { ngay, domain, range = 30 } = req.query;

        if (!ngay && !domain) {
            const kqxs = await KQXSModel.find({})
                .sort({
                    ngay: -1,
                })
                .limit(range);
            res.json(kqxs);

            return;
        }

        if (!ngay) {
            res.status(500).json({
                error: "Vui lòng cung cấp ngày cần xem kết quả",
            });
            return;
        }

        if (!domain) {
            res.status(500).json({
                error: "Vui lòng cung cấp miền cần xem kết quả",
            });
            return;
        }

        const kqxs = await KQXSModel.findOne({
            ngay: getTimeInVn(ngay),
            domain,
        });

        if (kqxs) {
            res.json(kqxs);
        } else {
            res.status(404).json({
                msg: "Không tìm thấy kết quả",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching" });
    }
};

const createResult = async (req, res) => {
    const kq = new KQXSModel(req.body);

    try {
        await kq.save();
        res.status(201).json(kq);
    } catch (error) {
        res.status(500).json({ error: "Error creating" });
    }
};

/**
 * method: POST
 * endpoint: /api/ketqua
 * body: {
 *  domain: 1 | 2 | 3 (Mien bac, Mien trung, Mien nam)
 *  thongke: ['dau', 'duoi', '']
 * }
 */

const mock = {
    domain: 1,
    ketqua: {
        giaidacbiet: [73121],
        giai1: [55217],
        giai2: [58651, 16695],
        giai3: [33566, 88641, 33460],
        giai4: [1730, 9916, 2124, 9960],
        giai5: [6043, 5427, "0070", 4002, 6493, 5809],
        giai6: [332, 983, 794],
        giai7: [64, 68, "07", 56],
    },
    thongke: {
        dau: {
            0: [2, 7, 8, 9],
            1: [6, 7],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
        },
        duoi: {
            0: [2, 3, 5, 6, 6, 7],
            1: [6, 7],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
        },
    },
    ngay: "06/10/2023",
};

module.exports = {
    getResult,
    createResult,
};
