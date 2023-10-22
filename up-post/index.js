const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://rongbachkim555.com",
        USERNAME: "rbk555",
        PASSWORD: "Abc!@#123",
    },
];
const DOMAINS = {
    1: "XSMB",
    2: "XSMT",
    3: "XSMN",
};

const loginToWordpress = async (page, { DOMAIN, USERNAME, PASSWORD }) => {
    await page.goto(DOMAIN + "/wp-login.php", { timeout: 0 });
    await page.evaluate(
        (username, password) => {
            document.querySelector("#user_login").value = username;
            document.querySelector("#user_pass").value = password;
            document.querySelector("#wp-submit").click();
        },
        USERNAME,
        PASSWORD
    );
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

const taoBaiVietSoiCau = async (page, domain, ngay, thang, nam) => {
    const date = new Date(`${thang}-${ngay}-${nam}`);
    const day = date.getDay();

    const post_type = {
        1: "soi_cau_mien_bac",
        2: "soi_cau_mien_trung",
        3: "soi_cau_mien_nam",
    };

    const provinces = Object.keys(Constants.LichQuayThuong[day][domain]);

    await page.goto(
        `https://rongbachkim555.com/wp-admin/post-new.php?post_type=${post_type[domain]}`,
        { timeout: 0 }
    );

    await page.evaluate(() => {
        document.querySelector("#set-post-thumbnail").click();
    });
    await sleep(1000);
    await page.type(
        "#media-search-input",
        `${ngay}-${thang}-${DOMAINS[domain]}`
    );

    await sleep(3000);

    await page.evaluate(() => {
        document.querySelector(".attachment").click();
        document.querySelector(".media-button").click();
    });

    await page.evaluate(
        (ngay, thang, nam, domain, domainLabel, provinces, day) => {
            document.querySelector("#content-html").click();
            const date = `${ngay}-${thang}-${nam}`;
            const dayLabel = day === 0 ? "Chủ nhật" : "Thứ " + (+day + 1);
            const ngayTuanTruoc = new Date(`${thang}-${ngay}-${nam}`);
            ngayTuanTruoc.setDate(ngay - 7);

            const renderNum = (num) => {
                return num < 10 ? "0" + num : num;
            };

            const ngayTuanTruocLabel = `${ngayTuanTruoc.getDate()}-${
                ngayTuanTruoc.getMonth() + 1
            }-${ngayTuanTruoc.getFullYear()}`;

            const genRandomNumber = () => {
                return Math.floor(Math.random() * 100);
            };

            const genCapLo = () => {
                const randomNumber = Math.floor(Math.random() * 90) + 10;
                const reverseNumber = parseInt(
                    randomNumber.toString().split("").reverse().join("")
                );

                return randomNumber + " - " + reverseNumber;
            };

            const randomMulNum = (amount) => {
                const nums = [];

                while (nums.length < amount) {
                    const num = genRandomNumber();

                    if (!nums.includes(num)) {
                        nums.push(renderNum(num));
                    }
                }

                return nums.join(" - ");
            };

            const random3Cang = (amount) => {
                const nums = [];

                while (nums.length < amount) {
                    const num = Math.floor(Math.random() * 900) + 100;

                    if (!nums.includes(num)) {
                        nums.push(renderNum(num));
                    }
                }

                return nums.join(" - ");
            };

            const gen1Num = () => {
                return Math.floor(Math.random() * 9);
            };

            let postContent = "";

            if (+domain === 1) {
                postContent = `
                Còn gì tuyệt vời hơn khi Anh Em tham khảo Kết Quả Soi Cầu Miền Bắc hôm nay ${dayLabel} ngày ${date} từ <strong><a href="https://rongbachkim555.com/">Rồng Bạch Kim 555</a></strong> và dành được thắng lợi. Những con số được các chuyên gia của chúng tôi dùng nhiều phương pháp soi cầu có tỉ lệ chính xác cao nhất ở thời điểm hiện tại cho ra dự đoán.

                <img class="alignnone size-full wp-image-226" src="https://rongbachkim555.com/wp-content/uploads/2023/10/${ngay}-${thang}-${domainLabel}.png" alt="" width="1800" height="942" />
                
                <h2>Cùng xem lại kết quả ${domainLabel} ${dayLabel} tuần rồi ngày ${ngayTuanTruocLabel}</h2>
                [ket_qua_xo_so domain="1" ngay="${ngayTuanTruocLabel}"]
                <h3>✅ Soi cầu Lô dự đoán XSMB ngày ${date}</h3>
                <div class="table_dudoan_wrapper">
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>🌟 Bạch thủ lô siêu VIP hôm nay: <span class="number-red">${genRandomNumber()}</span></td>
                </tr>
                <tr>
                <td>🌟 Cặp lô đẹp nhất hôm nay: <span class="number-red">${genCapLo()}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô xiên 2: <span class="number-red">${randomMulNum(
                    2
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô xiên 3: <span class="number-red">${randomMulNum(
                    3
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô kép đẹp nhất hôm nay: <span class="number-red">${
                    [11, 22, 33, 44, 55, 66, 77, 88, 99][
                        Math.floor(Math.random() * 9)
                    ]
                }</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn lô 4 số đẹp: <span class="number-red">${randomMulNum(
                    4
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn 3 càng lô 4 số đẹp: <span class="number-red">${random3Cang(
                    4
                )}</span></td>
                </tr>
                </tbody>
                </table>
                </div>
                <h3>✅ Soi cầu Đề dự đoán XSMB ngày ${date}</h3>
                <div class="table_dudoan_wrapper">
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>🌟 Bạch thủ đề siêu VIP hôm nay: <span class="number-red">${genRandomNumber(
                    4
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Đề đầu đuôi: <span class="number-red">Đầu ${gen1Num()} - Đuôi ${gen1Num()}</span></td>
                </tr>
                <tr>
                <td>🌟 3 càng đề đẹp: <span class="number-red">${random3Cang(
                    1
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 10 số: <span class="number-red">${randomMulNum(
                    10
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 36 số: <span class="number-red">${randomMulNum(
                    36
                )}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 50 số: <span class="number-red">${randomMulNum(
                    50
                )}</span></td>
                </tr>
                </tbody>
                </table>
                </div>
                Thông tin được chia sẻ hoàn toàn miễn phí. Mọi con số Lô và Đề được Rồng Bạch Kim 555 cập nhật liên tục đều đặt hàng ngày, tuy nhiên mọi thông tin chỉ mang tính tham khảo. Các bạn cần đọc thêm <a href="https://rongbachkim555.com/dieu-khoan/" target="_blank" rel="noopener">Điều khoản</a> từ chúng tôi để có cái nhìn khách quan nhất.
                
                Ngoài ra các bạn cũng có thể tham khảo thêm các thông tin Thống Kê KQXS Miền Bắc từ chúng tôi để nâng cao tỉ lệ chiến thắng:
                
                [thong_ke_general domain="1" ngay="${date}"]        
                `;
            } else {
                postContent = `
                Bạn đang tìm kiếm cho mình con số may mắn nhất trong ngày hôm nay. Đừng đánh lô đề theo cảm tính hoặc lựa chọn 1 con số ngẫu nhiên, không ai có thể may mắn theo thời gian dài bằng cách đánh may rủi này. Những con số được <strong><a href="https://rongbachkim555.com/">Rồng Bạch Kim 555</a></strong> đưa ra luôn có căn cứ.

                Chuyên gia của chúng tôi đã cập nhật Dự đoán KQ ${domainLabel} hôm nay ${dayLabel} ngày ${date} mở thưởng tại <strong>${provinces.join(
                    ", "
                )}</strong>. Bạn có thể tham khảo để lựa chọn cho mình những con số phù hợp nhất.
                
                <img class="alignnone size-full wp-image-211" src="https://rongbachkim555.com/wp-content/uploads/2023/10/${ngay}-${thang}-${domainLabel}.png" alt="" width="1200" height="628" />
                
                <h2>Cùng xem lại kết quả ${domainLabel} ${dayLabel} tuần rồi ngày ${ngayTuanTruocLabel}</h2>
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                ${provinces
                    .map((prv) => {
                        return `
                        <h3>✅ Soi cầu dự đoán kết quả xổ số ${prv} ngày ${date}</h3>
                        <div class="table_dudoan_wrapper">
                        <table class="table_dudoan">
                        <tbody>
                        <tr>
                        <td>🌟 Giải tám: <span class="number-red">${genRandomNumber()}</span></td>
                        </tr>
                        <tr>
                        <td>🌟 Đặc biệt: <span class="number-red">${genRandomNumber()}</span></td>
                        </tr>
                        <tr>
                        <td>🌟 Bao lô 2 số: <span class="number-red">${randomMulNum(2)}</span></td>
                        </tr>
                        </tbody>
                        </table>
                        </div>            
                    `;
                    })
                    .join("")}
                Cần lưu ý rằng những cặp số này được chúng tôi chia sẻ hoàn toàn miễn phí hàng ngày. Chúng tôi cập nhật số Lô và Đề liên tục đều đặt hàng ngày, tuy nhiên mọi thông tin chỉ mang tính tham khảo. Các bạn cần đọc thêm <a href="https://rongbachkim555.com/dieu-khoan/" target="_blank" rel="noopener">Điều khoản</a> từ chúng tôi để có cái nhìn khách quan nhất.
                
                Ngoài ra các bạn cũng có thể tham khảo thêm các thông tin Thống Kê KQ ${domainLabel} từ chúng tôi để nâng cao tỉ lệ chiến thắng:
                
                [thong_ke_general domain="${domain}" ngay="${date}"]        
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Rồng Bạch Kim 555 Soi Cầu Dự Đoán Kết Quả ${domainLabel} ${date}`;
            document.querySelector("#content").value = postContent;
        },
        ngay,
        thang,
        nam,
        domain,
        DOMAINS[domain],
        provinces,
        day
    );

    await sleep(2000);

    await page.evaluate(async (ngay, thang) => {
        document.querySelector(".edit-timestamp").click();
        document.querySelector("#jj").value = ngay;
        document.querySelector("#mm").value = thang;
        document.querySelector(".save-timestamp").click();
    }, ngay, thang);

    await sleep(1000);
    await page.click("#publish");
    await sleep(3000);

    // await page.waitForNavigation();
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

        for (let i = 0; i < WEBS.length; i++) {
            const web = WEBS[i];

            await loginToWordpress(page, web);
            await page.waitForNavigation();

            const DOMAIN = Constants.Domain.MienNam;

            for (let j = 1; j <= 31; j++) {
                try {
                    const date = j;
                    const month = 12;
                    const year = 2023;

                    await taoBaiVietSoiCau(page, DOMAIN, date, month, year);

                    console.log("Done: " + `${date}-${month}-${year}`);
                } catch (error) {
                    console.log("Error loop taoBaiViet", error);
                }
            }
        }

        process.exit();
    } catch (error) {
        console.log("Error main: ", error);
    }
};

main();
