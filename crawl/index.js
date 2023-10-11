const puppeteer = require("puppeteer");
const axios = require("axios");

const MIEN_BAC = 1;
const MIEN_TRUNG = 2;
const MIEN_NAM = 3;

const crawKQXSMB = async (page, date, month, year) => {
    const cDate = date < 10 ? "0" + date : date;
    const cMonth = month < 10 ? "0" + month : month;

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

    console.log("Done: ", `${date}-${month}-${year}`);
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

        await axios.post("http://localhost:6262/api/kqxs", {
            domain: MIEN_NAM,
            ketqua,
            thongke,
            province,
            ngay: new Date(`${month}-${date}-${year}`),
        });
    }

    console.log("Done: ", `${date}-${month}-${year}`);
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

        await axios.post("http://localhost:6262/api/kqxs", {
            domain: MIEN_TRUNG,
            ketqua,
            thongke,
            province,
            ngay: new Date(`${month}-${date}-${year}`),
        });
    }

    console.log("Done: ", `${date}-${month}-${year}`);
};

const crawKqxsMbHomNay = async (page) => {
    const currentDate = new Date();

    await crawKQXSMB(
        page,
        currentDate.getDate(),
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
    await crawKQXSMN(
        page,
        currentDate.getDate(),
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
    await crawKQXSMT(
        page,
        currentDate.getDate(),
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
};

const MONTHS = {
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 9,
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

        // const links = [];

        // for (let i = 1; i <= 30; i++) {
        //     await page.goto(
        //         `https://www.google.com.vn/search?q=XSMB ${i}/9/2023, Kết quả Xổ số Miền Bắc ngày ${i}-09-2023 xoso.com.vn`
        //     );

        //     const link = await page.evaluate(() => {
        //         return document.querySelector(".N54PNb a").href;
        //     });

        //     links.push(link);
        // }

        // console.log(links);

        // for (let j = 3; j <= 10; j++) {
        //     for (let i = 1; i <= MONTHS[j]; i++) {
        //         const date = i;
        //         const month = j;
        //         const year = new Date().getFullYear();
        //         await crawKQXSMT(page, date, month, year);
        //     }
        // }

        // await crawKQXS(page, 8, 10, 2023);
        // await crawKQXSMN(page, 9, 10, 2023);

        await crawKqxsMbHomNay(page);

        process.exit();
    } catch (error) {
        console.log("Error: ", error);
    }
};

main();
