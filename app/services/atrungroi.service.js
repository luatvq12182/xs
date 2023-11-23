const KQXS_CACHE = require("../../config/cache");
const { Constants } = require("../constants");
const { cvToHtml } = require("../templateHtmls/kqxs");
const { cvDateToYYYYMMDD } = require("../utils");

const alias = {
    an_giang: "An Giang",
    bac_lieu: "Bạc Liêu",
    ben_tre: "Bến Tre",
    binh_duong: "Bình Dương",
    binh_phuoc: "Bình Phước",
    binh_thuan: "Bình Thuận",
    ca_mau: "Cà Mau",
    can_tho: "Cần Thơ",
    da_lat: "Đà Lạt",
    dong_nai: "Đồng Nai",
    dong_thap: "Đồng Tháp",
    hau_giang: "Hậu Giang",
    ho_chi_minh: "TPHCM",
    kien_giang: "Kiên Giang",
    long_an: "Long An",
    soc_trang: "Sóc Trăng",
    tay_ninh: "Tây Ninh",
    tien_giang: "Tiền Giang",
    tra_vinh: "Trà Vinh",
    vinh_long: "Vĩnh Long",
    vung_tau: "Vũng Tàu",
    binh_dinh: "Bình Định",
    da_nang: "Đà Nẵng",
    dak_lak: "Đắk Lắk",
    dak_nong: "Đắk Nông",
    gia_lai: "Gia Lai",
    hue: "Huế",
    khanh_hoa: "Khánh Hòa",
    kon_tum: "Kon Tum",
    ninh_thuan: "Ninh Thuận",
    phu_yen: "Phú Yên",
    quang_binh: "Quảng Bình",
    quang_nam: "Quảng Nam",
    quang_ngai: "Quảng Ngãi",
    quang_tri: "Quảng Trị",
};

const DisplayType = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

const cvNumber = (num) => {
    return num <= 9 ? `0${num}` : num;
};

const xs = async (domain, type, page) => {
    if (type === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let kqxs =
            KQXS_CACHE.get()[domain][
                cvDateToYYYYMMDD(
                    `${yesterday.getDate()}-${
                        yesterday.getMonth() + 1
                    }-${yesterday.getFullYear()}`
                )
            ];

        kqxs = domain == Constants.Domain.MienBac ? kqxs : Object.values(kqxs);

        return [
            {
                ngay:
                    "" +
                    yesterday.getFullYear() +
                    cvNumber(yesterday.getMonth() + 1) +
                    cvNumber(yesterday.getDate()),
                html: cvToHtml(
                    domain,
                    `${yesterday.getDate()}-${
                        yesterday.getMonth() + 1
                    }-${yesterday.getFullYear()}`,
                    kqxs
                ),
            },
        ];
    }

    if (["today", "live"].includes(type)) {
        const date = new Date();

        let kqxs =
            KQXS_CACHE.get()[domain][
                cvDateToYYYYMMDD(
                    `${date.getDate()}-${
                        date.getMonth() + 1
                    }-${date.getFullYear()}`
                )
            ];

        kqxs = domain == Constants.Domain.MienBac ? kqxs : Object.values(kqxs);

        return [
            {
                ngay:
                    "" +
                    date.getFullYear() +
                    cvNumber(date.getMonth() + 1) +
                    cvNumber(date.getDate()),
                html: cvToHtml(
                    domain,
                    `${date.getDate()}-${
                        date.getMonth() + 1
                    }-${date.getFullYear()}`,
                    kqxs
                ),
            },
        ];
    }

    if (type === "30days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(KQXS_CACHE.get()[domain]);

            return data
                .slice(-30)
                .reverse()
                .map((kqxs) => {
                    const crDate = new Date(kqxs.ngay);

                    return {
                        ngay:
                            "" +
                            crDate.getFullYear() +
                            cvNumber(crDate.getMonth() + 1) +
                            cvNumber(crDate.getDate()),
                        html: cvToHtml(
                            domain,
                            `${crDate.getDate()}-${
                                crDate.getMonth() + 1
                            }-${crDate.getFullYear()}`,
                            kqxs
                        ),
                    };
                });
        } else {
            const hashMap = {};

            for (let i = 0; i <= 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    KQXS_CACHE.get()[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 30) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap)
                .slice((page - 1) * 5, (page - 1) * 5 + 5)
                .map((kqxs) => {
                    const crDate = new Date(kqxs[0].ngay);

                    return {
                        ngay:
                            "" +
                            crDate.getFullYear() +
                            cvNumber(crDate.getMonth() + 1) +
                            cvNumber(crDate.getDate()),
                        html: cvToHtml(
                            domain,
                            `${crDate.getDate()}-${
                                crDate.getMonth() + 1
                            }-${crDate.getFullYear()}`,
                            kqxs
                        ),
                    };
                });
        }
    }

    if (domain == Constants.Domain.MienBac) {
        const kqxs =
            KQXS_CACHE.get()[Constants.Domain.MienBac][DisplayType[type]];

        const data = kqxs.filter((e) => {
            const date = new Date(e.ngay);

            return date.getDay() === DisplayType[type];
        });

        return data.slice((page - 1) * 5, (page - 1) * 5 + 5).map((kqxs) => {
            const crDate = new Date(kqxs.ngay);

            return {
                ngay:
                    "" +
                    crDate.getFullYear() +
                    cvNumber(crDate.getMonth() + 1) +
                    cvNumber(crDate.getDate()),
                html: cvToHtml(
                    domain,
                    `${crDate.getDate()}-${
                        crDate.getMonth() + 1
                    }-${crDate.getFullYear()}`,
                    kqxs
                ),
            };
        });
    } else {
        if (Object.keys(DisplayType).includes(type)) {
            const hashMap = {};
            const kqxs = KQXS_CACHE.get()[domain][DisplayType[type]];

            kqxs.forEach((e) => {
                if (hashMap[e.ngay]) {
                    hashMap[e.ngay].push(e);
                } else {
                    hashMap[e.ngay] = [e];
                }
            });

            return Object.values(hashMap)
                .slice((page - 1) * 5, (page - 1) * 5 + 5)
                .map((kqxs) => {
                    const crDate = new Date(kqxs[0].ngay);

                    return {
                        ngay:
                            "" +
                            crDate.getFullYear() +
                            cvNumber(crDate.getMonth() + 1) +
                            cvNumber(crDate.getDate()),
                        html: cvToHtml(
                            domain,
                            `${crDate.getDate()}-${
                                crDate.getMonth() + 1
                            }-${crDate.getFullYear()}`,
                            kqxs
                        ),
                    };
                });
        } else {
            const data = KQXS_CACHE.get()[domain][alias[type]];

            return data
                .slice((page - 1) * 5, (page - 1) * 5 + 5)
                .map((kqxs) => {
                    const crDate = new Date(kqxs.ngay);

                    return {
                        ngay:
                            "" +
                            crDate.getFullYear() +
                            cvNumber(crDate.getMonth() + 1) +
                            cvNumber(crDate.getDate()),
                        html: cvToHtml(
                            domain,
                            `${crDate.getDate()}-${
                                crDate.getMonth() + 1
                            }-${crDate.getFullYear()}`,
                            kqxs
                        ),
                    };
                });
        }
    }
};

module.exports = {
    xs,
};
