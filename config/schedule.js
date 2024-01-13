const schedule = require("node-schedule");
const { getKQXSMT, getKQXSMB } = require("../test");

// Up bài KQXS vào mỗi 19h5m hàng ngày
// schedule.scheduleJob("0 23 * * *", async function () {
//     const today = new Date();
//     const date = today.getDate();
//     const month = today.getMonth() + 1;
//     const year = today.getFullYear();

//     await upBaiSoiCau888(+date, +month, +year);
//     await upBaiVuaXoSo(+date, +month, +year);
// });

// Cào kết quả xổ số và lưu vào DB mỗi 19h hàng ngày
// schedule.scheduleJob("0 19 * * *", function () {
//     console.log("Cào KQXS Hàng Ngày");
// });

// invalid cache vào 0h1m giờ sáng hàng ngày
// schedule.scheduleJob("1 0 * * *", function () {
//     CACHE.invalid();
// });

// schedule.scheduleJob("15 16 * * *", async function () {
//     console.log("Bắt đầu Crawl KQXS Miền Nam");

//     crawlKqxs(3);

//     const timeID = setInterval(() => crawlKqxs(3), 10000);

//     setTimeout(() => {
//         clearInterval(timeID);

//         console.log("Done Crawl KQXS Miền Nam");
//     }, 1000 * 60 * 25);
// });

schedule.scheduleJob("15 17 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Trung");

    getKQXSMT();

    const timeID = setInterval(() => getKQXSMT(), 10000);

    setTimeout(() => {
        clearInterval(timeID);

        console.log("Done Crawl KQXS Miền Trung");
    }, 1000 * 60 * 25);
});

schedule.scheduleJob("15 18 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Bắc");

    getKQXSMB();

    const timeID = setInterval(() => getKQXSMB(), 10000);

    setTimeout(() => {
        clearInterval(timeID);

        console.log("Done Crawl KQXS Miền Bắc");
    }, 1000 * 60 * 17);
});
