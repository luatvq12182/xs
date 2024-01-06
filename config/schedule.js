const puppeteer = require("puppeteer");
const schedule = require("node-schedule");
const CACHE = require("./cache");
const { upBaiSoiCau888 } = require("../up-post/soicau888");

const crawlKqxs = async (domain) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: true,
        timeout: 300000,
    });

    try {
        const page = await browser.newPage();

        const link = `https://xoso.com.vn`;

        await page.goto(link, {
            timeout: 0,
        });

        const rs = await page.evaluate(() => {
            const rs = [];

            const provinces = document.querySelectorAll(".table-xsmt tr a");

            provinces.forEach((p, index) => {
                const ketqua = {};
                const thongke = {
                    dau: {},
                };

                [
                    ...document.querySelectorAll(
                        `.table-xsmt tr td:nth-child(${index + 2})`
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

        if (domain == 1) {
            CACHE.set("KQXS-TODAY", {
                ...CACHE.get("KQXS-TODAY"),
                [domain]: rs,
            });
        } else {
            CACHE.set("KQXS-TODAY", {
                ...CACHE.get("KQXS-TODAY"),
                [domain]: rs.reduce((pre, cr) => {
                    return {
                        ...pre,
                        [cr.province]: cr,
                    };
                }, {}),
            });
        }
    } catch (error) {
        console.log("Error: ", error);
    }

    await browser.close();
};

// Up bài KQXS vào mỗi 10h hàng ngày
schedule.scheduleJob("0 0 * * *", async function () {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    await upBaiSoiCau888(+date, +month, +year);
    await upBaiVuaXoSo(+date, +month, +year);
});

// Cào kết quả xổ số và lưu vào DB mỗi 19h hàng ngày
schedule.scheduleJob("19 0 * * *", function () {
    console.log("Cào KQXS Hàng Ngày");
});

// invalid cache vào 1 giờ sáng hàng ngày
schedule.scheduleJob("1 0 * * *", function () {
    CACHE.invalid();
});

schedule.scheduleJob("15 16 * * *", async function () {
    console.log("Bắt đầu Crawl KQXS Miền Nam");

    // crawlKqxs(3, 1, 1, 2024);

    // const timeID = setInterval(() => crawlKqxs(3, 1, 1, 2024), 30000);

    // setTimeout(() => {
    //     clearInterval(timeID);
    // }, 1000 * 60 * 25);
});

schedule.scheduleJob("15 17 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Trung");

    // crawlKqxs(2, 1, 1, 2024);

    // const timeID = setInterval(() => crawlKqxs(2, 1, 1, 2024), 30000);

    // setTimeout(() => {
    //     clearInterval(timeID);
    // }, 1000 * 60 * 25);
});

schedule.scheduleJob("15 18 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Bắc");
});
