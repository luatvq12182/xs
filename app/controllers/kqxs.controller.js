const KQXS_CACHE = require("../../config/cache");
const { Constants } = require("../constants");
const KQXSModel = require("../models/kqxs.model");
const { cvToHtml } = require("../templateHtmls/kqxs");
const { cvDateToYYYYMMDD } = require("../utils");

const gResult = (req, res) => {
    const { ngay, domain, province, cvHtml } = req.query;

    const cvDate = cvDateToYYYYMMDD(ngay);

    let kqxs = KQXS_CACHE.get()[domain][cvDate];

    if (province) {
        kqxs = kqxs[province];
    }

    if (domain != Constants.Domain.MienBac && !province) {
        kqxs = Object.values(kqxs);
    }

    res.json(cvHtml ? cvToHtml(domain, ngay, kqxs) : kqxs);
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

const updateResult = async (req, res) => {
    const { domain, ngay, province } = req.query;
    const payload = req.body;
    const cvDate = cvDateToYYYYMMDD(ngay);

    let kqxs = KQXS_CACHE.get()[domain][cvDate];

    if (province) {
        kqxs = kqxs[province];
    }

    try {
        await KQXSModel.findByIdAndUpdate(kqxs._id, payload);

        res.status(200).json(kqxs);
    } catch (error) {
        res.status(500).json({ error: "Error creating" });
    }
};

module.exports = {
    createResult,
    gResult,
    updateResult,
};
