const jwt = require("jsonwebtoken");
const { generateRandomString } = require("../utils");

const genToken = (_req, res) => {
    const secretKey = process.env.JWT_SECRET;

    const payload = {
        random: generateRandomString(16),
    };

    const token = jwt.sign(payload, secretKey, { algorithm: "HS256" });

    res.json({
        accessToken: token,
    });
};

module.exports = {
    genToken,
};
