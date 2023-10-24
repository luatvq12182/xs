const axios = require("axios");
// const { format } = require("date-fns");
const puppeteer = require("puppeteer");

const MIEN_BAC = 1;
const MIEN_TRUNG = 2;
const MIEN_NAM = 3;

const getKQ = async (ngay, thang, nam, domain, province) => {
    try {
        const dateFind = ngay + "-" + thang + "-" + nam;

        let url =
            "http://localhost:6262/api/kqxs?ngay=" +
            dateFind +
            "&domain=" +
            domain;

        if (province) {
            url += "&province=" + province;
        }

        const res = await axios.get(url);

        return res.data;
    } catch (error) {
        return null;
    }
};

const crawKQXSMB = async (page, date, month, year) => {
    const cDate = date < 10 ? "0" + date : date;
    const cMonth = month < 10 ? "0" + month : month;

    const isExist = await getKQ(date, month, year, 1);

    if (isExist) {
        console.log(`Đã cào KQXSMB ngày: ${date}-${month}-${year}`);
        return;
    }

    const link = `https://xoso.com.vn/xsmb-${cDate}-${cMonth}-${year}.html`;

    await page.goto(link, {
        timeout: 0,
    });

    const { ketqua, thongke } = await page.evaluate(() => {
        const thongke = [...document.querySelectorAll(".table-loto td")].map(
            (e) => e.textContent
        );

        return {
            ketqua: {
                madacbiet: document
                    .querySelector("#mb_prizeCode")
                    .innerText.replaceAll("\n", "-"),
                giaidacbiet: document
                    .querySelectorAll("tr td")[1]
                    .innerText.split("\n"),
                giai1: document
                    .querySelectorAll("tr td")[2]
                    .innerText.split("\n"),
                giai2: document
                    .querySelectorAll("tr td")[3]
                    .innerText.split("\n"),
                giai3: document
                    .querySelectorAll("tr td")[4]
                    .innerText.split("\n"),
                giai4: document
                    .querySelectorAll("tr td")[5]
                    .innerText.split("\n"),
                giai5: document
                    .querySelectorAll("tr td")[6]
                    .innerText.split("\n"),
                giai6: document
                    .querySelectorAll("tr td")[7]
                    .innerText.split("\n"),
                giai7: document
                    .querySelectorAll("tr td")[8]
                    .innerText.split("\n"),
            },
            thongke: {
                dau: thongke
                    .filter((_, index) => index % 2 === 0)
                    .reduce((pre, cr, index) => {
                        return {
                            ...pre,
                            [index]: cr.split(", "),
                        };
                    }, {}),
                duoi: thongke
                    .filter((_, index) => index % 2 === 1)
                    .reduce((pre, cr, index) => {
                        return {
                            ...pre,
                            [index]: cr.split(", "),
                        };
                    }, {}),
            },
        };
    });

    await axios.post("http://localhost:6262/api/kqxs", {
        domain: MIEN_BAC,
        ketqua,
        thongke,
        ngay: new Date(`${month}-${date}-${year}`),
    });

    console.log("Done craw XSMB: ", `${date}-${month}-${year}`);
};

const crawKQXSMN = async (page, date, month, year) => {
    const cDate = date < 10 ? "0" + date : date;
    const cMonth = month < 10 ? "0" + month : month;

    const link = `https://xoso.com.vn/xsmn-${cDate}-${cMonth}-${year}.html`;

    await page.goto(link, {
        timeout: 0,
    });

    const rs = await page.evaluate(() => {
        const rs = [];

        const provinces = document.querySelectorAll(".table-xsmn tr a");

        provinces.forEach((p, index) => {
            const ketqua = {};
            const thongke = {
                dau: {},
            };

            [
                ...document.querySelectorAll(
                    `.table-xsmn tr td:nth-child(${index + 2})`
                ),
            ]
                .reverse()
                .forEach((e, i) => {
                    ketqua[i === 0 ? "giaidacbiet" : `giai${i}`] =
                        e.innerText.split("\n");
                });

            [
                ...document.querySelectorAll(
                    `.table-loto tr td:nth-child(${index + 2})`
                ),
            ].forEach((e, i) => {
                thongke["dau"][i] = e.innerText.split(", ");
            });

            rs.push({
                ketqua,
                thongke,
                province: p.innerText,
            });
        });

        return rs;
    });

    for (let i = 0; i < rs.length; i++) {
        const { ketqua, thongke, province } = rs[i];

        const isExist = await getKQ(date, month, year, 3, province);

        if (isExist) {
            console.log(
                `Đã cào KQXSMN ngày: ${date}-${month}-${year} tỉnh ${province}`
            );
            continue;
        }

        await axios.post("http://localhost:6262/api/kqxs", {
            domain: MIEN_NAM,
            ketqua,
            thongke,
            province,
            ngay: new Date(`${month}-${date}-${year}`),
        });
    }

    console.log("Done craw XSMN: ", `${date}-${month}-${year}`);
};

const crawKQXSMT = async (page, date, month, year) => {
    const cDate = date < 10 ? "0" + date : date;
    const cMonth = month < 10 ? "0" + month : month;

    const link = `https://xoso.com.vn/xsmt-${cDate}-${cMonth}-${year}.html`;

    await page.goto(link, {
        timeout: 0,
    });

    const rs = await page.evaluate(() => {
        const rs = [];

        const provinces = document.querySelectorAll(".table-xsmn tr a");

        provinces.forEach((p, index) => {
            const ketqua = {};
            const thongke = {
                dau: {},
            };

            [
                ...document.querySelectorAll(
                    `.table-xsmn tr td:nth-child(${index + 2})`
                ),
            ]
                .reverse()
                .forEach((e, i) => {
                    ketqua[i === 0 ? "giaidacbiet" : `giai${i}`] =
                        e.innerText.split("\n");
                });

            [
                ...document.querySelectorAll(
                    `.table-loto tr td:nth-child(${index + 2})`
                ),
            ].forEach((e, i) => {
                thongke["dau"][i] = e.innerText.split(", ");
            });

            rs.push({
                ketqua,
                thongke,
                province: p.innerText,
            });
        });

        return rs;
    });

    for (let i = 0; i < rs.length; i++) {
        const { ketqua, thongke, province } = rs[i];

        const isExist = await getKQ(date, month, year, 2, province);

        if (isExist) {
            console.log(
                `Đã cào KQXSMN ngày: ${date}-${month}-${year} tỉnh ${province}`
            );
            continue;
        }

        await axios.post("http://localhost:6262/api/kqxs", {
            domain: MIEN_TRUNG,
            ketqua,
            thongke,
            province,
            ngay: new Date(`${month}-${date}-${year}`),
        });
    }

    console.log("Done craw XSMT: ", `${date}-${month}-${year}`);
};

const crawKQXS = async (page, date, month, year) => {
    await crawKQXSMB(page, date, month, year);
    await crawKQXSMN(page, date, month, year);
    await crawKQXSMT(page, date, month, year);
};

const crawKQXSHomNay = async (page) => {
    const currentDate = new Date();

    await crawKQXS(
        page,
        currentDate.getDate(),
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
};

const MONTHS = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};

const main = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            ignoreHTTPSErrors: true,
            timeout: 300000,
        });

        const page = await browser.newPage();

        // await crawKQXSHomNay(page);
        await crawKQXS(page, 23, 10, 2023);

        // for (let i = 4; i <= 4; i++) { // dang cao den thang 5
        //     for (let j = 1; j <= MONTHS[i]; j++) {
        //         try {
        //             await crawKQXS(page, j, i, 2020);
        //         } catch (error) {
        //             console.log(`Error in: ${j}/${i}/2020`, error);
        //         }
        //     }
        // }

        process.exit();
    } catch (error) {
        console.log("Error: ", error);
    }
};

main();
