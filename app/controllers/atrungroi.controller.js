const { Constants } = require("../constants");
const ATrungRoiService = require("../services/atrungroi.service");

const xs = async (req, res) => {
    try {
        const { display_type, domain, page } = req.query;

        const data = await ATrungRoiService.xs(domain, display_type, +page);

        res.json(data);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Error fetching" });
    }
};

const result = async (req, res) => {
    try {
        const { domain, cvHtml, province } = req.query;

        const data = await ATrungRoiService.result(domain, province, cvHtml);

        res.json(data);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Error fetching" });
    }
};

module.exports = {
    xs,
    result,
};
