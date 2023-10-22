const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicau9999.pro",
        USERNAME: "admin",
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

const taoBaiVietSoiCau = async (DOMAIN, page, domain, ngay, thang, nam) => {
    const date = new Date(`${thang}-${ngay}-${nam}`);
    const day = date.getDay();

    const post_type = {
        1: "soi_cau_mien_bac",
        2: "soi_cau_mien_trung",
        3: "soi_cau_mien_nam",
    };

    const provinces = Object.keys(Constants.LichQuayThuong[day][domain]);

    await page.goto(
        DOMAIN + `/wp-admin/post-new.php?post_type=${post_type[domain]}`,
        { timeout: 0 }
    );

    await page.evaluate(() => {
        document.querySelector("#set-post-thumbnail").click();
    });
    await sleep(1000);
    await page.type(
        "#media-search-input",
        `${DOMAINS[domain]}-${ngay}-${thang}`
    );

    await sleep(6000);

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
                return Math.floor(Math.random() * 99);
            };

            const genCapLo = () => {
                let randomNumber;
                let reverseNumber;

                randomNumber = Math.floor(Math.random() * 90) + 10;

                while (
                    [99, 88, 77, 66, 55, 44, 33, 22, 11].includes(randomNumber)
                ) {
                    randomNumber = Math.floor(Math.random() * 90) + 10;
                }

                reverseNumber = parseInt(
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
                Soi Cầu 9999 sở hữu một đội ngũ chuyên gia với nhiều năm kinh nghiệm soi kèo và phân tích lô đề. Trong ngày ${date}, hãy cùng đi tìm con số may mắn nhất thông qua các phương pháp soi cầu cùng chúng tôi nhé.

                [caption id="attachment_536" align="alignnone" width="1200"]<img class="size-full wp-image-536" src="https://soicau9999.pro/wp-content/uploads/2023/10/XSMB-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MB Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MB Hôm Nay ${date}[/caption]
                
                Xem lại KQXS Miền Bắc ${dayLabel} tuần trước Ngày ${date}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Với nhiều năm kinh nghiệm Soi Cầu 9999 có thể cho số miền Bắc ngày ${date} và tất cả những ngày khác với tỉ lệ trúng cực cao. Theo đánh giá của các Anh Em, những con số từ các chuyên gia cung cấp luôn mang về tỷ lệ trúng giải cao với xác suất cao đến không tưởng.
                
                Để đạt được thành quả đó chúng tôi phải tập hợp được đội ngũ chuyên gia giỏi nhất với nhiều năm kinh nghiệm. Họ giành nhiều thời gian để tìm ra công thức phân tích và thuật toán ngày càng chính xác hơn cho người dùng. Để không mất nhiều thời gian của các bạn, hãy xem xem hôm nay SC 9999 cho Anh Em những con số gì nha.
                <div class="table_dudoan_wrapper">
                <h3>✅ Soi cầu Lô dự đoán XSMB ngày ${date}</h3>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>🌟 Bạch thủ lô siêu VIP hôm nay: <span class="number-red">${renderNum(
                    genRandomNumber()
                )}</span></td>
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
                <td>🌟 Bạch thủ đề siêu VIP hôm nay: <span class="number-red">${renderNum(
                    genRandomNumber(4)
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
                Muốn tìm ra con số chơi lô đề chuẩn xác, người dùng nên tổng hợp lại bảng kết quả xổ số miền Bắc những kỳ trước. Từ đó, anh em có thể so sánh, phân tích và tìm ra quy luật trò chơi. Lúc này, việc lựa chọn một con số may mắn sẽ dễ dàng và tăng cơ hội trúng giải.
                [thong_ke_general domain="${domain}" ngay="${date}"]
                </div>                
                `;
            } else if (+domain === 3) {
                postContent = `
                    Hãy cùng đi tìm những con số may mắn nhất trong xổ số miền Nam ngày ${date} với đội ngũ chuyên gia giàu kinh nghiệm. Nhận về những con số may mắn nhất của ${
                    provinces.length
                } nhà đài ${provinces.join(
                    ", "
                )} ngày hôm nay cùng chúng tôi nhé.

                    [caption id="attachment_543" align="alignnone" width="1200"]<img class="size-full wp-image-543" src="https://soicau9999.pro/wp-content/uploads/2023/10/XSMN-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MN Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MN Hôm Nay ${ngay}-${thang}-2023[/caption]
                    
                    Xem lại KQXS Miền Nam vào ${dayLabel} tuần trước Ngày ${date}
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]
                    
                    Nhờ những bí kíp độc không công bố ra ngoài, các chuyên gia của Soi Cầu 9999 có thể cho số miền Nam hôm nay với tỉ lệ chính xác cực cao. Anh EM có thể tham khảo các con số mà chúng tôi đưa ra để mang về những phần thưởng ngoài mong đợi.
                    
                    Với nhiều năm kinh nghiệm theo dõi thị trường xổ số và phân tích kết quả, đội ngũ chuyên gia Soi Cầu 9999 có khả năng soi cầu chính xác, phân tích cực kì thuyết phục để đề xuất các con số có tỷ lệ thắng cao cho các bạn.
                    
                    ${provinces
                        .map((prv) => {
                            return `
                            <h3>✅ Rồng Bạch Kim 666 soi cầu KQXS ${prv} ngày ${date}</h3>
                            <div class="table_dudoan_wrapper">
                            <table class="table_dudoan">
                            <tbody>
                            <tr>
                            <td>🌟 Giải tám: <span class="number-red">${renderNum(
                                genRandomNumber()
                            )}</span></td>
                            </tr>
                            <tr>
                            <td>🌟 Đặc biệt: <span class="number-red">${renderNum(
                                genRandomNumber()
                            )}</span></td>
                            </tr>
                            <tr>
                            <td>🌟 Bao lô 2 số: <span class="number-red">${randomMulNum(
                                2
                            )}</span></td>
                            </tr>
                            </tbody>
                            </table>
                            </div>            
                        `;
                        })
                        .join("")}                
                    
                    1 Trong những cách để loại bỏ những con số có tỉ lệ không về là so sánh với các bảng Thống kê. Với những người có thâm niên trong ngành Lô Đề chắc chắn họ sẽ phải tham khảo Bảng thống kê trước khi chốt số. Anh Em cũng nên tập làm quen với việc theo dõi các bảng Thống kê để rút ra phương pháp soi cầu cho riêng bản thân mình.
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]         
                    `;
            } else {
                postContent = `
                Đội ngũ chuyên gia giàu kinh nghiệm ngày đêm nghiên cứu để phát triển công cụ soi cầu, cho số miền Trung chính xác. Hệ thống có thể chốt được các giải đặc biệt, giải tám, bao lô 2 số... của miền Trung đạt hiệu quả cao. Cùng theo dõi kết quả cho số ngày ${date} cùng chúng tôi nhé.

                [caption id="attachment_576" align="alignnone" width="1200"]<img class="size-full wp-image-576" src="https://soicau9999.pro/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MT Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MT Hôm Nay ${ngay}-${thang}-2023[/caption]
                
                Xem lại KQXS Miền Trung vào ${dayLabel} tuần trước Ngày ${date}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Soi Cầu 9999 có thể giúp bạn dự đoán và cho số miền Trung với độ chuẩn xác cao dựa vào các phương pháp lô xiên, bạc nhớ, tổng đề, bóng âm dương. Cùng đi tìm con số may mắn trong ngày ${date}.
                
                Soi Cầu 9999 tập hợp một đội ngũ chuyên gia có nhiều năm kinh nghiệm trong việc cho số miền Trung. Họ có phương pháp riêng để tổng hợp lại kết quả xổ số miền Trung nhiều kỳ sau đó so sánh và tìm ra quy luật.
                
                ${provinces
                    .map((prv) => {
                        return `
                        <h3>✅ Soi cầu xổ số Miền Trung đài ${prv} ngày ${date}</h3>
                        <div class="table_dudoan_wrapper">
                        <table class="table_dudoan">
                        <tbody>
                        <tr>
                        <td>🌟 Giải tám: <span class="number-red">${renderNum(
                            genRandomNumber()
                        )}</span></td>
                        </tr>
                        <tr>
                        <td>🌟 Đặc biệt: <span class="number-red">${renderNum(
                            genRandomNumber()
                        )}</span></td>
                        </tr>
                        <tr>
                        <td>🌟 Bao lô 2 số: <span class="number-red">${randomMulNum(
                            2
                        )}</span></td>
                        </tr>
                        </tbody>
                        </table>
                        </div>            
                    `;
                    })
                    .join("")}                
                
                Sau khi đã nhận được những con số may mắn ngày ngày ${date} chính xác và tăng cơ hội thắng. Thông qua những phân tích chuyên sâu và khả năng chọn lọc tốt, chúng tôi luôn đưa ra những gợi ý mang về tỷ lệ trúng giải cao cho người chơi. Tuy nhiên để chắc chắn bạn cũng có thể xem các Bảng thống kê dưới đây và tự phân tích thêm để có sự lựa chọn đúng đắn.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Soi Cầu 9999 Dự Đoán KQXS ${
                domain == 1 ? "MB" : domain == 2 ? "MT" : "MN"
            } Hôm Nay ${date}`;
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

    await page.evaluate(
        async (ngay, thang) => {
            document.querySelector(".edit-timestamp").click();
            document.querySelector("#jj").value = ngay;
            document.querySelector("#mm").value = thang;
            document.querySelector(".save-timestamp").click();
        },
        ngay,
        thang
    );

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

        const MONTHS = {
            10: 31,
            11: 30,
            12: 31,
        };

        for (let i = 0; i < WEBS.length; i++) {
            const web = WEBS[i];

            await loginToWordpress(page, web);
            await page.waitForNavigation();

            for (let d = 1; d <= 3; d++) {
                for (let m = 10; m <= 12; m++) {
                    for (let j = 1; j <= MONTHS[m]; j++) {
                        try {
                            const DOMAIN = d;

                            const date = j;
                            const month = m;
                            const year = 2023;

                            await taoBaiVietSoiCau(
                                web.DOMAIN,
                                page,
                                DOMAIN,
                                date,
                                month,
                                year
                            );

                            console.log("Done: " + `${date}-${month}-${year}`);
                        } catch (error) {
                            console.log("Error loop taoBaiViet", error);
                        }
                    }
                }
            }
        }

        process.exit();
    } catch (error) {
        console.log("Error main: ", error);
    }
};

main();
