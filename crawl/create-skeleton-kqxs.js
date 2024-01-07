const axios = require("axios");

const Constants = {
    Domain: {
        MienBac: 1,
        MienTrung: 2,
        MienNam: 3,
        XSMB: 1,
        XSMT: 2,
        XSMN: 3,
        1: "XSMB",
        2: "XSMT",
        3: "XSMN",
    },
};

const LICH_QUAY_THUONG = {
    0: {
        1: {
            "Thái Bình": [],
        },
        2: {
            Huế: [],
            "Khánh Hòa": [],
            "Kon Tum": [],
        },
        3: {
            "Đà Lạt": [],
            "Kiên Giang": [],
            "Tiền Giang": [],
        },
    },
    1: {
        1: {
            "Hà Nội": [],
        },
        2: {
            Huế: [],
            "Phú Yên": [],
        },
        3: {
            "Cà Mau": [],
            "Đồng Tháp": [],
            TPHCM: [],
        },
    },
    2: {
        1: {
            "Quảng Ninh": [],
        },
        2: {
            "Đắk Lắk": [],
            "Quảng Nam": [],
        },
        3: {
            "Bạc Liêu": [],
            "Bến Tre": [],
            "Vũng Tàu": [],
        },
    },
    3: {
        1: {
            "Bắc Ninh": [],
        },
        2: {
            "Đà Nẵng": [],
            "Khánh Hòa": [],
        },
        3: {
            "Cần Thơ": [],
            "Đồng Nai": [],
            "Sóc Trăng": [],
        },
    },
    4: {
        1: {
            "Hà Nội": [],
        },
        2: {
            "Bình Định": [],
            "Quảng Bình": [],
            "Quảng Trị": [],
        },
        3: {
            "An Giang": [],
            "Bình Thuận": [],
            "Tây Ninh": [],
        },
    },
    5: {
        1: {
            "Hải Phòng": [],
        },
        2: {
            "Gia Lai": [],
            "Ninh Thuận": [],
        },
        3: {
            "Bình Dương": [],
            "Trà Vinh": [],
            "Vĩnh Long": [],
        },
    },
    6: {
        1: {
            "Nam Định": [],
        },
        2: {
            "Đà Nẵng": [],
            "Đắk Nông": [],
            "Quảng Ngãi": [],
        },
        3: {
            "Bình Phước": [],
            "Hậu Giang": [],
            "Long An": [],
            TPHCM: [],
        },
    },
};

const SkeletonData = (domain, province) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    if (domain == 1) {
        return {
            domain,
            ketqua: {
                madacbiet: "",
                giaidacbiet: [null],
                giai1: [null],
                giai2: [null, null],
                giai3: [null, null, null, null, null, null],
                giai4: [null, null, null, null],
                giai5: [null, null, null, null, null, null],
                giai6: [null, null, null],
                giai7: [null, null, null, null],
            },
            thongke: {
                dau: {
                    0: [],
                    1: [],
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
                    0: [],
                    1: [],
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
            ngay: today,
        };
    } else {
        return {
            domain,
            ketqua: {
                giaidacbiet: [null],
                giai1: [null],
                giai2: [null],
                giai3: [null, null],
                giai4: [null, null, null, null, null, null, null],
                giai5: [null],
                giai6: [null, null, null],
                giai7: [null],
                giai8: [null],
            },
            province: province,
            thongke: {
                dau: {
                    0: [],
                    1: [],
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
            ngay: today,
        };
    }
};

const genPrizeToday = () => {
    const prizeToday = {
        1: {},
        2: {},
        3: {},
    };

    const today = new Date();

    for (let domain = 1; domain <= 3; domain++) {
        if (domain === 1) {
            const payload = SkeletonData(domain);

            prizeToday[1] = payload;
        } else {
            const provinces = Object.keys(
                LICH_QUAY_THUONG[today.getDay()][domain]
            );

            for (let province = 0; province < provinces.length; province++) {
                const payload = SkeletonData(domain, provinces[province]);

                prizeToday[domain][provinces[province]] = payload;
            }
        }
    }

    return prizeToday;
};

module.exports = {
    genPrizeToday,
};

// const main = async () => {
//     try {
//         const today = new Date();

//         for (let domain = 1; domain <= 3; domain++) {
//             if (domain === 1) {
//                 const payload = SkeletonData(domain);

//                 await axios.post("http://localhost:6262/api/kqxs", payload);

//                 console.log("Done: ", Constants.Domain[domain]);
//             } else {
//                 const provinces = Object.keys(
//                     LICH_QUAY_THUONG[today.getDay()][domain]
//                 );

//                 for (
//                     let province = 0;
//                     province < provinces.length;
//                     province++
//                 ) {
//                     const payload = SkeletonData(domain, provinces[province]);

//                     await axios.post("http://localhost:6262/api/kqxs", payload);

//                     console.log("Done: ", Constants.Domain[domain]);
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };

// main();
