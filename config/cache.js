// const NodeCache = require("node-cache");
// const myCache = new NodeCache();

const { Constants } = require("../app/constants");
const kqxsModel = require("../app/models/kqxs.model");

const cvNum = (num) => {
    return num >= 10 ? num : `0${num}`;
};

const DEFAULT_CACHE = () => {
    return {
        1: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        },
        2: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            "Bình Định": {},
            "Đà Nẵng": {},
            "Đắk Lắk": {},
            "Đắk Nông": {},
            "Gia Lai": {},
            Huế: {},
            "Khánh Hòa": {},
            "Kon Tum": {},
            "Ninh Thuận": {},
            "Phú Yên": {},
            "Quảng Bình": {},
            "Quảng Nam": {},
            "Quảng Ngãi": {},
            "Quảng Trị": {},
        },
        3: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            "An Giang": {},
            "Bạc Liêu": {},
            "Bến Tre": {},
            "Bình Dương": {},
            "Bình Phước": {},
            "Bình Thuận": {},
            "Cà Mau": {},
            "Cần Thơ": {},
            "Đà Lạt": {},
            "Đồng Nai": {},
            "Đồng Tháp": {},
            "Hậu Giang": {},
            TPHCM: {},
            "Kiên Giang": {},
            "Long An": {},
            "Sóc Trăng": {},
            "Tây Ninh": {},
            "Tiền Giang": {},
            "Trà Vinh": {},
            "Vĩnh Long": {},
            "Vũng Tàu": {},
        },
    };
};

const KQXS_CACHE = (() => {
    let data = DEFAULT_CACHE();

    return {
        set: (newCacheData) => {
            data = newCacheData;
        },
        get: () => {
            return data;
        },
        invalid: async () => {
            console.time("Time to query");
            const kqxs = await kqxsModel
                .find({})
                .sort({
                    ngay: -1,
                })
                .limit(3000);
            console.timeEnd("Time to query");

            console.time("Time to set cache");
            const cacheData = DEFAULT_CACHE();

            kqxs.forEach((kq) => {
                const cvKqToObj = kq.toObject();

                const domain = cvKqToObj.domain;
                const date = new Date(cvKqToObj.ngay);
                const cvDate = `${date.getFullYear()}${cvNum(
                    date.getMonth() + 1
                )}${cvNum(date.getDate())}`;

                if (domain == Constants.Domain.MienBac) {
                    cacheData[cvKqToObj.domain][cvDate] = cvKqToObj;
                } else {
                    if (!cacheData[cvKqToObj.domain][cvDate]) {
                        cacheData[cvKqToObj.domain][cvDate] = {};
                    }

                    cacheData[cvKqToObj.domain][cvDate][cvKqToObj.province] =
                        cvKqToObj;

                    cacheData[cvKqToObj.domain][cvKqToObj.province][cvDate] =
                        cvKqToObj;
                }

                cacheData[cvKqToObj.domain][date.getDay()].push(cvKqToObj);
            });

            KQXS_CACHE.set(cacheData);

            console.timeEnd("Time to set cache");

            console.log("Invalid done!");
        },
    };
})();

module.exports = KQXS_CACHE;
