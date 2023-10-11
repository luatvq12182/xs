const { Constants } = require("../constants");
const KQXSModel = require("../models/kqxs.model");

const getResult = async (req, res) => {
    try {
        const { ngay, domain, province } = req.query;

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

        if (+domain !== Constants.Domain.MienBac && !province) {
            res.status(500).json({
                error: "Vui lòng cung cấp tỉnh thành cần xem kết quả",
            });
            return;
        }

        const query = {
            ngay: {
                $gte: new Date(ngay),
            },
            domain,
        };

        if (+domain !== Constants.Domain.MienBac) {
            query.province = province;
        }

        const kqxs = await KQXSModel.findOne(query);

        if (kqxs) {
            res.json(kqxs);
        } else {
            res.status(404).json({
                msg: "Không tìm thấy kết quả",
            });
        }
    } catch (error) {
        console.log(error);

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
