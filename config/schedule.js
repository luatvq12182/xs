const schedule = require("node-schedule");
const { getKQXSMT, getKQXSMB, getKQXSMN } = require("../crawxsminhngoc");

schedule.scheduleJob("15 16 * * *", async function () {
    console.log("Bắt đầu Crawl KQXS Miền Nam");

    getKQXSMN();

    const timeID = setInterval(() => getKQXSMN(), 10000);

    setTimeout(() => {
        clearInterval(timeID);

        console.log("Done Crawl KQXS Miền Nam");
    }, 1000 * 60 * 25);
});

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
