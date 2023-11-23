const crypto = require("crypto");

// Function to generate a random string of a specified length
function generateRandomString(length) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex") // Convert to hexadecimal format
        .slice(0, length); // Return the required number of characters
}

function lay10SoLonNhat(obj) {
    const arr = Object.entries(obj);

    arr.sort((a, b) => b[1] - a[1]);

    const top10 = arr.slice(0, 10);

    return top10;
}

function lay10SoBeNhat(obj) {
    const arr = Object.entries(obj);

    arr.sort((a, b) => a[1] - b[1]);

    const top10 = arr.slice(0, 10);

    return top10;
}

const cvNum = (num) => {
    return num >= 10 ? num : `0${num}`;
};

const cvDateToYYYYMMDD = (ngay) => {
    const [d, m, y] = ngay.split("-");

    return `${y}${cvNum(m)}${cvNum(d)}`;
};

const require_query_params = (params) => {
    return (req, res, next) => {
        let isValid = true;
        const missing = [];

        params.forEach((p) => {
            if (!req.query[p]) {
                isValid = false;
                missing.push(p);
            }
        });

        if (isValid) {
            next();
        } else {
            res.status(400).json({
                msg: "Missing query params",
                missing,
            });
        }
    };
};

module.exports = {
    generateRandomString,
    lay10SoLonNhat,
    lay10SoBeNhat,
    cvNum,
    cvDateToYYYYMMDD,
    require_query_params,
};
