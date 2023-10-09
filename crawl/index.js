const puppeteer = require("puppeteer");
const axios = require("axios");

const crawKQXS = async (page, date, month, year) => {
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
        domain: 1,
        ketqua,
        thongke,
        ngay: new Date(`${month}-${date}-${year}`),
    });

    console.log("Done: ", `${date}-${month}-${year}`);
};

const crawXqxsMbHomNay = (page) => {
    const currentDate = new Date();

    crawKQXS(
        page,
        currentDate.getDate(),
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
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

        for (let i = 1; i <= 31; i++) {
            const date = i;
            const month = 3;
            const year = new Date().getFullYear();
            await crawKQXS(page, date, month, year);
        }

        // await crawKQXS(page, 8, 10, 2023);

        process.exit();
    } catch (error) {
        console.log("Error: ", error);
    }
};

main();
