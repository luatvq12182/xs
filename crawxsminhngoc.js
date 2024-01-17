const axios = require("axios");
const cheerio = require("cheerio");

const createKqxs = (payload) => {
    return axios.post("https://apixoso.com/api/kqxs", payload);
};

const invalidCache = () => {
    return axios.post("https://apixoso.com/api/invalid-cache");
};

const getKQXSMN = async ({ onFinish }) => {
    console.log("Cào xsmn...");

    const url = "https://www.xosominhngoc.com/xo-so-truc-tiep/mien-nam.html";

    const payload = {};

    const today = new Date();

    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            const tableRs = $(".bkqmiennam table table");

            tableRs.each((_, el) => {
                let province = $(el).find(".tinh").text()?.trim();

                if (province === 'TP. HCM') {
                    province = 'TPHCM';
                }

                payload[province] = {
                    province,
                    domain: 3,
                    ketqua: {},
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
                    ngay: new Date(
                        `${
                            today.getMonth() + 1
                        }-${today.getDate()}-${today.getFullYear()}`
                    ),
                };

                const giai8 = $(el).find(".giai8");
                const giai7 = $(el).find(".giai7");
                const giai6 = $(el).find(".giai6");
                const giai5 = $(el).find(".giai5");
                const giai4 = $(el).find(".giai4");
                const giai3 = $(el).find(".giai3");
                const giai2 = $(el).find(".giai2");
                const giai1 = $(el).find(".giai1");
                const giaidacbiet = $(el).find(".giaidb");

                [
                    { el: giai8, key: "giai8" },
                    { el: giai7, key: "giai7" },
                    { el: giai6, key: "giai6" },
                    { el: giai5, key: "giai5" },
                    { el: giai4, key: "giai4" },
                    { el: giai3, key: "giai3" },
                    { el: giai2, key: "giai2" },
                    { el: giai1, key: "giai1" },
                    { el: giaidacbiet, key: "giaidacbiet" },
                ].forEach(({ el, key }) => {
                    $(el)
                        .find("div")
                        .each((_, el) => {
                            let value;

                            if ($(el).find("span").length === 0) {
                                value = $(el).text();
                            } else {
                                value = "";
                            }

                            if (!payload[province].ketqua[key]) {
                                payload[province].ketqua[key] = [value];
                            } else {
                                payload[province].ketqua[key].push(value);
                            }
                        });
                });

                const nums = Object.values(payload[province].ketqua)
                    .flat()
                    .map((e) => {
                        return e.slice(-2);
                    });

                nums.forEach((num) => {
                    payload[province].thongke.dau[num[0]]?.push(num[1]);
                });
            });

            axios
                .post("https://apixoso.com/api/set-kqxs-today-cache", {
                    domain: 3,
                    data: payload,
                })
                .then(() => {
                    console.log("update done!");
                });

            let isDone = true;

            Object.values(payload).forEach((kq) => {
                const nums = Object.values(kq.ketqua).flat().filter(Boolean);

                if (nums.length < 18) {
                    isDone = false;
                }
            });

            if (isDone && onFinish) {
                onFinish();

                Promise.all(
                    Object.values(payload).map((kq) => {
                        return createKqxs(kq);
                    })
                ).then(() => {
                    invalidCache();
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

const getKQXSMT = async ({ onFinish }) => {
    console.log("Cào xsmt...");

    const url = "https://www.xosominhngoc.com/xo-so-truc-tiep/mien-trung.html";

    const payload = {};

    const today = new Date();

    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            const tableRs = $(".bkqmiennam table table");

            tableRs.each((_, el) => {
                let province = $(el).find(".tinh").text()?.trim();

                if (province === 'Thừa T. Huế') {
                    province = 'Huế';
                }

                payload[province] = {
                    province,
                    domain: 2,
                    ketqua: {},
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
                    ngay: new Date(
                        `${
                            today.getMonth() + 1
                        }-${today.getDate()}-${today.getFullYear()}`
                    ),
                };

                const giai8 = $(el).find(".giai8");
                const giai7 = $(el).find(".giai7");
                const giai6 = $(el).find(".giai6");
                const giai5 = $(el).find(".giai5");
                const giai4 = $(el).find(".giai4");
                const giai3 = $(el).find(".giai3");
                const giai2 = $(el).find(".giai2");
                const giai1 = $(el).find(".giai1");
                const giaidacbiet = $(el).find(".giaidb");

                [
                    { el: giai8, key: "giai8" },
                    { el: giai7, key: "giai7" },
                    { el: giai6, key: "giai6" },
                    { el: giai5, key: "giai5" },
                    { el: giai4, key: "giai4" },
                    { el: giai3, key: "giai3" },
                    { el: giai2, key: "giai2" },
                    { el: giai1, key: "giai1" },
                    { el: giaidacbiet, key: "giaidacbiet" },
                ].forEach(({ el, key }) => {
                    $(el)
                        .find("div")
                        .each((_, el) => {
                            let value;

                            if ($(el).find("span").length === 0) {
                                value = $(el).text();
                            } else {
                                value = "";
                            }

                            if (!payload[province].ketqua[key]) {
                                payload[province].ketqua[key] = [value];
                            } else {
                                payload[province].ketqua[key].push(value);
                            }
                        });
                });

                const nums = Object.values(payload[province].ketqua)
                    .flat()
                    .map((e) => {
                        return e.slice(-2);
                    });

                nums.forEach((num) => {
                    payload[province].thongke.dau[num[0]]?.push(num[1]);
                });
            });

            axios
                .post("https://apixoso.com/api/set-kqxs-today-cache", {
                    domain: 2,
                    data: payload,
                })
                .then(() => {
                    console.log("update done!");
                });

            let isDone = true;

            Object.values(payload).forEach((kq) => {
                const nums = Object.values(kq.ketqua).flat().filter(Boolean);

                if (nums.length < 18) {
                    isDone = false;
                }
            });

            if (isDone && onFinish) {
                onFinish();

                Promise.all(
                    Object.values(payload).map((kq) => {
                        return createKqxs(kq);
                    })
                ).then(() => {
                    invalidCache();
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

const getKQXSMB = async ({ onFinish }) => {
    console.log("Cào xsmb...");

    const url = "https://www.xosominhngoc.com/xo-so-truc-tiep/mien-bac.html";

    let payload = {};

    const today = new Date();

    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            const tableRs = $(".bkqmienbac table table");

            tableRs.each((_, el) => {
                payload = {
                    domain: 1,
                    ketqua: {
                        madacbiet: "",
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
                    ngay: new Date(
                        `${
                            today.getMonth() + 1
                        }-${today.getDate()}-${today.getFullYear()}`
                    ),
                };

                const giai7 = $(el).find(".giai7");
                const giai6 = $(el).find(".giai6");
                const giai5 = $(el).find(".giai5");
                const giai4 = $(el).find(".giai4");
                const giai3 = $(el).find(".giai3");
                const giai2 = $(el).find(".giai2");
                const giai1 = $(el).find(".giai1");
                const giaidacbiet = $(el).find(".giaidb");
                const madacbiet = $(el)?.find(".loai_ve span")?.first()?.text();

                [
                    { el: giaidacbiet, key: "giaidacbiet" },
                    { el: giai1, key: "giai1" },
                    { el: giai2, key: "giai2" },
                    { el: giai3, key: "giai3" },
                    { el: giai4, key: "giai4" },
                    { el: giai5, key: "giai5" },
                    { el: giai6, key: "giai6" },
                    { el: giai7, key: "giai7" },
                ].forEach(({ el, key }) => {
                    $(el)
                        .find("div")
                        .each((_, el) => {
                            let value;

                            if ($(el).find("span").length === 0) {
                                value = $(el).text();
                            } else {
                                value = "";
                            }

                            if (!payload.ketqua[key]) {
                                payload.ketqua[key] = [value];
                            } else {
                                payload.ketqua[key].push(value);
                            }
                        });
                });

                payload.ketqua.madacbiet = madacbiet || "";

                const nums = Object.values(payload.ketqua)
                    .slice(1)
                    .flat()
                    .map((e) => {
                        return e?.slice(-2);
                    });

                nums.forEach((num) => {
                    payload.thongke.dau[num[0]]?.push(num[1]);
                    payload.thongke.duoi[num[1]]?.push(num[0]);
                });
            });

            axios
                .post("https://apixoso.com/api/set-kqxs-today-cache", {
                    domain: 1,
                    data: payload,
                })
                .then(() => {
                    console.log("update done!");
                });

            const nums = Object.values(payload.ketqua).flat().filter(Boolean);

            if (nums.length === 28 && onFinish) {
                onFinish();

                createKqxs(payload).then(() => {
                    invalidCache();
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

module.exports = {
    getKQXSMB,
    getKQXSMT,
    getKQXSMN,
};
