const schedule = require("node-schedule");
const { getKQXSMT, getKQXSMB, getKQXSMN } = require("../crawxsminhngoc");

schedule.scheduleJob("10 16 * * *", async function () {
    console.log("Bắt đầu Crawl KQXS Miền Nam");

    getKQXSMN();

    const timeID = setInterval(
        () =>
            getKQXSMN({
                onFinish: () => {
                    clearInterval(timeID);

                    console.log("Done Crawl KQXS Miền Nam");
                },
            }),
        10000
    );
});

schedule.scheduleJob("10 17 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Trung");

    getKQXSMT();

    const timeID = setInterval(
        () =>
            getKQXSMT({
                onFinish: () => {
                    clearInterval(timeID);

                    console.log("Done Crawl KQXS Miền Trung");
                },
            }),
        10000
    );
});

schedule.scheduleJob("10 18 * * *", function () {
    console.log("Bắt đầu Crawl KQXS Miền Bắc");

    getKQXSMB();

    const timeID = setInterval(
        () =>
            getKQXSMB({
                onFinish: () => {
                    clearInterval(timeID);

                    console.log("Done Crawl KQXS Miền Bắc");
                },
            }),
        10000
    );
});
