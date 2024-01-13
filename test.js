const axios = require("axios");
const cheerio = require("cheerio");

const getKQXSMN = () => {
    const url = "https://www.xosominhngoc.com/xo-so-truc-tiep/mien-nam.html";

    const payload = {};

    const tachSo = (str, num) => {
        let inputString = str;
        let segmentLength = Math.ceil(inputString.length / num); // Độ dài của mỗi đoạn

        let resultArray = [];
        for (let i = 0; i < inputString.length; i += segmentLength) {
            let segment = inputString.substring(i, i + segmentLength);
            resultArray.push(segment);
        }

        return resultArray.map((e) => e.trim());
    };

    const today = new Date();

    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            const tableRs = $(".bkqmiennam table table");

            tableRs.each((_, el) => {
                const province = $(el).find(".tinh").text()?.trim();
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

                const Giai4 = $(el)
                    .find(".giai4 div")
                    .each((_, el) => {
                        console.log($(el).text());

                        // $(el)
                        //     .find("span")
                        //     .each((_, el) => {
                        //         console.log(province, el.text());
                        //     });
                    });

                // console.log($(el).find(".giai4 div span").length);

                const giai8 = $(el).find(".giai8").text()?.trim();
                const giai7 = $(el).find(".giai7").text()?.trim();
                const giai6 = $(el).find(".giai6").text()?.trim();
                const giai5 = $(el).find(".giai5").text()?.trim();
                const giai4 = $(el).find(".giai4").text()?.trim();
                const giai3 = $(el).find(".giai3").text()?.trim();
                const giai2 = $(el).find(".giai2").text()?.trim();
                const giai1 = $(el).find(".giai1").text()?.trim();
                const giaidacbiet = $(el).find(".giaidb").text()?.trim();

                payload[province].ketqua.giai8 = [giai8];
                payload[province].ketqua.giai7 = [giai7];
                payload[province].ketqua.giai6 = tachSo(
                    giai6.padEnd(12, " "),
                    3
                );
                payload[province].ketqua.giai5 = [giai5];
                payload[province].ketqua.giai4 = tachSo(
                    giai4.padEnd(35, " "),
                    7
                );
                payload[province].ketqua.giai3 = tachSo(
                    giai3.padEnd(10, " "),
                    2
                );
                payload[province].ketqua.giai2 = [giai2];
                payload[province].ketqua.giai1 = [giai1];
                payload[province].ketqua.giaidacbiet = [giaidacbiet];

                const nums = Object.values(payload[province].ketqua)
                    .flat()
                    .map((e) => {
                        return e.slice(-2);
                    });

                nums.forEach((num) => {
                    payload[province].thongke.dau[num[0]]?.push(num[1]);
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

const getKQXSMT = async () => {
    console.log("Cào xsmt...");
    const res = await axios("https://apixoso.com/api/kqxs-today-cache");

    const url = "https://www.xosominhngoc.com/xo-so-truc-tiep/mien-trung.html";

    const payload = {};

    const today = new Date();

    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            const tableRs = $(".bkqmiennam table table");

            tableRs.each((_, el) => {
                const province = $(el).find(".tinh").text()?.trim();
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
                    ...res.data,
                    2: payload,
                })
                .then(() => {
                    console.log("update done!");
                });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

const getKQXSMB = async () => {
    console.log("Cào xsmb...");
    const res = await axios("https://apixoso.com/api/kqxs-today-cache");

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

                [
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

                const nums = Object.values(payload.ketqua)
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
                    ...res.data,
                    1: payload,
                })
                .then(() => {
                    console.log("update done!");
                });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

getKQXSMT();

module.exports = {
    getKQXSMB,
    getKQXSMT,
    getKQXSMN,
};
