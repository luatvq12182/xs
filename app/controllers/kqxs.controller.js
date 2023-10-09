const KQXSModel = require("../models/kqxs.model");

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
            ngay: {
                $lte: ngay,
            },
            domain,
        }).sort({
            ngay: -1,
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

module.exports = {
    getResult,
    createResult,
};
