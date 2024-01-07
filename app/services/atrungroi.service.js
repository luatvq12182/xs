const CACHE = require("../../config/cache");
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
            CACHE.get("KQXS")[domain][
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

    if (["live"].includes(type)) {
        const date = new Date();

        let kqxs =
            CACHE.get("KQXS")[domain][
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

    if (type === "today") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

            return data
                .slice(-7)
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

            for (let i = 0; i <= 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 7) {
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

    if (type === "30days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

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
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 30) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap).map((kqxs) => {
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

    if (type === "90days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

            return data
                .slice(-90)
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

            for (let i = 0; i <= 90; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 90) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap).map((kqxs) => {
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

    if (type === "120days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

            return data
                .slice(-120)
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

            for (let i = 0; i <= 120; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 120) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap).map((kqxs) => {
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

    if (type === "200days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

            return data
                .slice(-200)
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

            for (let i = 0; i <= 200; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 200) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap).map((kqxs) => {
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

    if (type === "300days") {
        if (domain == Constants.Domain.MienBac) {
            let data = Object.values(CACHE.get("KQXS")[domain]);

            return data
                .slice(-300)
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

            for (let i = 0; i <= 300; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                const kqxs =
                    CACHE.get("KQXS")[domain][
                        `${date.getFullYear()}${cvNumber(
                            date.getMonth() + 1
                        )}${cvNumber(date.getDate())}`
                    ];

                if (kqxs && Object.values(hashMap).length <= 300) {
                    hashMap[i] = Object.values(kqxs);
                }
            }

            return Object.values(hashMap).map((kqxs) => {
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
            CACHE.get("KQXS")[Constants.Domain.MienBac][DisplayType[type]];

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
            const kqxs = CACHE.get("KQXS")[domain][DisplayType[type]];

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
            const data = Object.values(CACHE.get("KQXS")[domain][alias[type]]);

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

const isLive = (domain) => {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();

    if (domain == 1 && hour == 18 && minutes >= 15 && minutes <= 31) {
        return true;
    }

    if (domain == 2 && hour == 17 && minutes >= 15 && minutes <= 31) {
        return true;
    }

    if (domain == 3 && hour == 16 && minutes >= 15 && minutes <= 31) {
        return true;
    }

    return false;
};

const result = async (domain, province, cvHtml = 1) => {
    let date = new Date();
    let kqxs;

    if (
        (domain == Constants.Domain.MienBac && date.getHours() < 18) ||
        (domain == Constants.Domain.MienTrung && date.getHours() < 17) ||
        (domain == Constants.Domain.MienNam && date.getHours() < 16)
    ) {
        date.setDate(date.getDate() - 1);

        kqxs =
            CACHE.get("KQXS")[domain][
                cvDateToYYYYMMDD(
                    `${date.getDate()}-${
                        date.getMonth() + 1
                    }-${date.getFullYear()}`
                )
            ];
    } else {
        if (isLive(domain)) {
            kqxs = CACHE.get("KQXS-TODAY")[domain];
        } else {
            kqxs =
                CACHE.get("KQXS")[domain][
                    cvDateToYYYYMMDD(
                        `${date.getDate()}-${
                            date.getMonth() + 1
                        }-${date.getFullYear()}`
                    )
                ];
        }
    }

    kqxs = domain == Constants.Domain.MienBac ? kqxs : Object.values(kqxs);

    if (+cvHtml) {
        return {
            ngay:
                "" +
                date.getFullYear() +
                cvNumber(date.getMonth() + 1) +
                cvNumber(date.getDate()),
            day: date.getDay(),
            html: cvToHtml(
                domain,
                `${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`,
                kqxs
            ),
        };
    } else {
        return kqxs;
    }
};

module.exports = {
    xs,
    result,
};
