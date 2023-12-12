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

function generateDateArray(inputDate, numberOfDays) {
    const dateArray = [];

    const [day, month, year] = inputDate.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    let currentDate = new Date(formattedDate);

    for (let i = 0; i < numberOfDays; i++) {
        if (i > 0) currentDate.setDate(currentDate.getDate() - 1);
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dd = String(currentDate.getDate()).padStart(2, "0");
        const formattedResult = `${yyyy}${mm}${dd}`;
        dateArray.push(formattedResult);
    }

    return dateArray;
}

function generateDateArrayByYearAndMonth(year, month) {
    const dateArray = [];

    // Tạo ngày đầu tiên của tháng
    const firstDayOfMonth = new Date(year, month - 1, 1);

    // Lặp qua từng ngày của tháng và thêm vào mảng
    for (let i = 0; i < new Date(year, month, 0).getDate(); i++) {
        const currentDate = new Date(firstDayOfMonth);
        currentDate.setDate(firstDayOfMonth.getDate() + i);

        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dd = String(currentDate.getDate()).padStart(2, "0");

        const formattedResult = `${yyyy}${mm}${dd}`;
        dateArray.push(formattedResult);
    }

    return dateArray;
}

function generateDateArrayByStartDateEndDate(startDate, endDate) {
    const dateArray = [];

    const [startDay, startMonth, startYear] = startDate.split("-");
    const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

    const [endDay, endMonth, endYear] = endDate.split("-");
    const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

    let currentDate = new Date(formattedStartDate);
    const finalDate = new Date(formattedEndDate);

    while (currentDate <= finalDate) {
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dd = String(currentDate.getDate()).padStart(2, "0");
        const formattedResult = `${yyyy}${mm}${dd}`;
        dateArray.push(formattedResult);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

function countOccurrences(character, array) {
    // Sử dụng hàm reduce để đếm số lần xuất hiện của kí tự
    const occurrences = array.reduce((count, element) => {
        if (element == character) {
            return count + 1;
        }
        return count;
    }, 0);

    return occurrences;
}

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

const genNumsByTotal = (total) => {
    const data = {};

    for (let i = 0; i < 100; i++) {
        if (i < 10 && i == total) {
            data[i.toString().padStart(2, "0")] = {};
        } else {
            const nums = i.toString();
            const totalNum = +nums[0] + +nums[1];

            if (totalNum == total || totalNum - 10 == total) {
                data[i.toString().padStart(2, "0")] = {};
            }
        }
    }

    return data;
};

module.exports = {
    generateRandomString,
    lay10SoLonNhat,
    lay10SoBeNhat,
    cvNum,
    cvDateToYYYYMMDD,
    require_query_params,
    generateDateArray,
    generateDateArrayByYearAndMonth,
    generateDateArrayByStartDateEndDate,
    countOccurrences,
    genNumsByTotal,
};
