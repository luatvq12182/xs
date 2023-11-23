// const NodeCache = require("node-cache");
// const myCache = new NodeCache();

const { Constants } = require("../app/constants");
const kqxsModel = require("../app/models/kqxs.model");

const cvNum = (num) => {
    return num >= 10 ? num : `0${num}`;
};

const KQXS_CACHE = (() => {
    return {
        data: {
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
                "Bình Định": [],
                "Đà Nẵng": [],
                "Đắk Lắk": [],
                "Đắk Nông": [],
                "Gia Lai": [],
                Huế: [],
                "Khánh Hòa": [],
                "Kon Tum": [],
                "Ninh Thuận": [],
                "Phú Yên": [],
                "Quảng Bình": [],
                "Quảng Nam": [],
                "Quảng Ngãi": [],
                "Quảng Trị": [],
            },
            3: {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                "An Giang": [],
                "Bạc Liêu": [],
                "Bến Tre": [],
                "Bình Dương": [],
                "Bình Phước": [],
                "Bình Thuận": [],
                "Cà Mau": [],
                "Cần Thơ": [],
                "Đà Lạt": [],
                "Đồng Nai": [],
                "Đồng Tháp": [],
                "Hậu Giang": [],
                TPHCM: [],
                "Kiên Giang": [],
                "Long An": [],
                "Sóc Trăng": [],
                "Tây Ninh": [],
                "Tiền Giang": [],
                "Trà Vinh": [],
                "Vĩnh Long": [],
                "Vũng Tàu": [],
            },
        },
        get: () => {
            return KQXS_CACHE.data;
        },
        invalid: async () => {
            const kqxs = await kqxsModel
                .find({})
                .sort({
                    ngay: -1,
                })
                .limit(3000);

            kqxs.forEach((kq) => {
                const domain = kq.toObject().domain;
                const date = new Date(kq.toObject().ngay);
                const cvDate = `${date.getFullYear()}${cvNum(
                    date.getMonth() + 1
                )}${cvNum(date.getDate())}`;

                if (domain == Constants.Domain.MienBac) {
                    KQXS_CACHE.data[kq.toObject().domain][cvDate] =
                        kq.toObject();
                } else {
                    if (!KQXS_CACHE.data[kq.toObject().domain][cvDate]) {
                        KQXS_CACHE.data[kq.toObject().domain][cvDate] = {};
                    }

                    KQXS_CACHE.data[kq.toObject().domain][cvDate][
                        kq.toObject().province
                    ] = kq.toObject();

                    KQXS_CACHE.data[kq.toObject().domain][
                        kq.toObject().province
                    ].push(kq.toObject());
                }

                KQXS_CACHE.data[kq.toObject().domain][date.getDay()].push(
                    kq.toObject()
                );
            });

            console.log("Invalid done!");
        },
    };
})();

module.exports = KQXS_CACHE;
