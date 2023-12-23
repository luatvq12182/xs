const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicau366.org",
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
    await sleep(2000);
    await page.type(
        "#media-search-input",
        `${DOMAINS[domain]}-${ngay}-${thang}-2024`
    );

    await sleep(9000);

    await page.evaluate(() => {
        document.querySelector(".attachment").click();
    });

    await sleep(1000);

    await page.evaluate(() => {
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

                    if (!nums.includes(renderNum(num))) {
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
                Soi Cầu 366 - nơi cung cấp những con số lô đề đẹp nhất cho xổ số miền Bắc (XSMB) hôm nay ngày ${date}. Được các chuyên gia nhiều năm kinh nghiệm của chúng tôi phân tích và soi cầu, đem lại những con số chính xác có khả năng về cao nhất cho anh chị em tham khảo, được rất nhiều anh chị em tin tưởng và sử dụng hàng ngày.
                
                <img class="alignnone size-full wp-image-538" src="https://soicau366.org/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMB-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />
                
                <h2>Tham khảo thống kê KQXS Miền Bắc của Soi Cầu 366</h2>
                Hãy cùng Soi Cầu 366 xem lại kết quả xổ số miền Bắc từ kỳ quay trước để phát hiện những cặp số đẹp và may mắn sẽ xuất hiện trong ngày hôm nay.
                <h2>Cùng xem lại kết quả XSMB ${dayLabel} tuần rồi ngày ${date}</h2>
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                [thong_ke_general domain="${domain}" ngay="${date}"]
                
                <h2>Soi cầu 366 chốt số miễn phí Miền Bắc hôm nay ngày ${date}</h2>
                Dự đoán soi cầu 366 XSMB hôm nay ngày ${date} dựa trên các thuật toán và công cụ phân tích, mang đến cho bạn những cầu bạch thủ và cầu đặc biệt số vô cùng đẹp, với xác suất về cao nhất nên anh chị em hoàn toàn tự tin tham khảo.

                <div class="table_dudoan_wrapper">
                <h3>✅ Soi cầu Lô dự đoán XSMB ngày ${date}</h3>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>🌟 Bạch thủ lô siêu VIP hôm nay: <span class="number-red">${renderNum(genRandomNumber())}</span></td>
                </tr>
                <tr>
                <td>🌟 Cặp lô đẹp nhất hôm nay: <span class="number-red">${genCapLo()}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô xiên 2: <span class="number-red">${randomMulNum(2)}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô xiên 3: <span class="number-red">${randomMulNum(3)}</span></td>
                </tr>
                <tr>
                <td>🌟 Lô kép đẹp nhất hôm nay: <span class="number-red">${
                    [11, 22, 33, 44, 55, 66, 77, 88, 99][
                        Math.floor(Math.random() * 9)
                    ]
                }</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn lô 4 số đẹp: <span class="number-red">${randomMulNum(4)}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn 3 càng lô 4 số đẹp: <span class="number-red">${random3Cang(4)}</span></td>
                </tr>
                </tbody>
                </table>
                </div>
                <h3>✅ Soi cầu Đề dự đoán XSMB ngày ${date}</h3>
                <div class="table_dudoan_wrapper">
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>🌟 Bạch thủ đề siêu VIP hôm nay: <span class="number-red">${renderNum(genRandomNumber(4))}</span></td>
                </tr>
                <tr>
                <td>🌟 Đề đầu đuôi: <span class="number-red">Đầu ${gen1Num()} - Đuôi ${gen1Num()}</span></td>
                </tr>
                <tr>
                <td>🌟 3 càng đề đẹp: <span class="number-red">${random3Cang(1)}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 10 số: <span class="number-red">${randomMulNum(10)}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 36 số: <span class="number-red">${randomMulNum(36)}</span></td>
                </tr>
                <tr>
                <td>🌟 Dàn đề 50 số: <span class="number-red">${randomMulNum(50)}</span></td>
                </tr>
                </tbody>
                </table>
                </div>

                <h2>Soi cầu 366 XSMB chính xác hôm nay ${date}</h2>
                Có không ít anh em đã thay đổi cuộc đời và đi cùng Soi Cầu 366 trong suốt thời gian qua. Vì thế, chỉ cần anh em giữ niềm tin và kiên nhẫn, vận may sẽ chắc chắn đến với họ. Những con số mà soicau366 cung cấp chỉ mang tính chất tham khảo, nhằm giúp anh em có thêm thông tin để phân tích và lựa chọn tốt nhất khi tham gia chơi. Chúc anh em may mắn!                             
                `;
            } else if (+domain === 3) {
                postContent = `
                    Soi cầu dự đoán xổ số miền Nam hôm nay ngày ${date} siêu chính xác. Soi Cầu 366 cung cấp thông tin soi cầu xổ số, dự đoán KQXS MN, thống kê và kết quả XSMN một cách nhanh chóng và hoàn toàn miễn phí. Chúng tôi áp dụng các phương pháp phân tích thống kê và soi cầu thông minh để tạo ra những cặp số có khả năng về cao nhất trong ngày. Hãy cập nhật hàng ngày để nhận ngay những cặp số đẹp nhất!

                    <img class="alignnone size-full wp-image-538" src="https://soicau366.org/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMN-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />
                    
                    <h2>Tham khảo thống kê KQXS Miền Nam ${dayLabel} tuần trước của Soi Cầu 366</h2>

                    [ket_qua_xo_so domain="3" ngay="${date}"]

                    Hi vọng rằng thông qua việc phân tích dữ liệu và những dự đoán chốt số, soi cầu XSMN hôm nay từ các chuyên gia ở đây sẽ giúp anh em tìm ra những con số đẹp và chuẩn xác nhất cho ngày hôm nay.
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]    
                    
                    Soi cầu 366 miễn phí là một công cụ được nhiều người tin dùng. Tuy nhiên, việc tìm ra cặp số ưng ý có khả năng về cao không hề dễ dàng. Phương pháp soi cầu 366 XSMN của chúng tôi dựa trên công nghệ thống kê thông minh để tạo ra những cặp số đẹp nhất. Đội ngũ chuyên gia có nhiều kinh nghiệm cùng với các công cụ hiện đại sẽ đưa ra những cặp số có xác suất cao vào ngày hôm nay.

                    ${provinces
                        .map((prv) => {
                            return `
                            <h3>✅ Soi cầu 366 chốt số KQXS ${prv} ngày ${date}</h3>
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
                        
                    <h2>Soi cầu 366 dự đoán XSMN chính xác hôm nay</h2>

                    Hi vọng rằng soi cầu 366 sẽ hỗ trợ anh em trong việc dự đoán các con số XSMN hôm nay, giúp tìm ra những con số may mắn nhất cho mình. Tất cả các con số mà chúng tôi cung cấp đều chỉ mang tính chất tham khảo. Anh em hãy cân nhắc kỹ trước khi áp dụng các dự đoán này. Chúc anh em may mắn!
                    `;
            } else {
                postContent = `
                Soi cầu dự đoán KQXS Miền Trung hôm nay ngày ${date} tại Soi Cầu 366 là kết quả của việc lựa chọn những cặp số có tỷ lệ cao nhất dự kiến về trong ngày do nhiều chuyên gia chốt số chúng tôi phân tích. Để chọn những con số Soi cầu miền Trung chính xác nhất, mời anh em tham khảo nội dung dưới đây để chọn ra cho mình một kết quả tốt nhất.

                <img class="alignnone size-full wp-image-538" src="https://soicau366.org/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMT-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />

                <h2>Thống kê KQXS Miền Trung ${dayLabel} tuần trước của Soi Cầu 366</h2>

                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                Chúng tôi cam kết cập nhật nhanh nhất kết quả XSMT để cung cấp thông tin thống kê về cầu lô và cầu đặc biệt cho anh em. Nhằm giúp anh em lựa chọn những con số phù hợp, chúng tôi mời anh em tham khảo kết quả thống kê từ <strong><a href="https://soicau366.org/">soi cầu 366</a></strong> miễn phí dưới đây.

                [thong_ke_general domain="${domain}" ngay="${date}"]

                <h2>Soi cầu 666 xổ số Miền Trung hôm nay ngày ${date}</h2>
                
                Hy vọng anh em sẽ tìm được con số ưng ý trong những cặp số mà soi cầu 366 đã cập nhật ở dưới và gặt hái được những phần thưởng lớn. Mặc dù các con số của chúng tôi có tỷ lệ cao, nhưng chỉ mang tính tương đối. Anh em hãy cân nhắc kỹ lưỡng trước khi sử dụng để tham gia quay thưởng nhé!                

                ${provinces
                    .map((prv) => {
                        return `
                        <h3>✅ Soi cầu 366 kết quả xổ số Miền Trung đài ${prv} ngày ${date}</h3>
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
                
                    <h2>Soi cầu 366 dự đoán XSMT chính xác hôm nay ${date}</h2>
                    Soi cầu 366 đã chia sẻ những con số đẹp nhất của XSMT hôm nay cùng hướng dẫn cách soi cầu chính xác, nhằm giúp mọi người có thêm kinh nghiệm trong việc chọn số. Hy vọng thông tin từ soi cầu 366 sẽ góp phần vào thành công của anh em trong các ngày sắp tới.
                `;
            }

            if (domain == 1) {
                document.querySelector("#title").value = `Soi Cầu 366 – Dự Đoán KQXS Miền Bắc Miễn Phí Ngày ${date}`;
            }

            if (domain == 3) {
                document.querySelector("#title").value = `Soi Cầu 366 – Dự Đoán KQXS Miền Nam Miễn Phí Ngày ${date}`;
            }

            if (domain == 2) {
                document.querySelector("#title").value = `Soi Cầu 366 – Dự Đoán KQXS Miền Trung Miễn Phí Ngày ${date}`;
            }

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

    await sleep(1000);

    await page.evaluate(
        async (ngay, thang) => {
            const MONTHS = {
                1: 30,
                2: 29,
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

            document.querySelector(".edit-timestamp").click();
            document.querySelector("#jj").value = (+ngay > 1) ? (+ngay - 1) : (MONTHS[(+thang - 1) || 12]);
            document.querySelector("#mm").value = ((+ngay > 1) ? thang : ((+thang - 1) || 12)).toString().padStart(2, '0');
            document.querySelector("#aa").value = 2024;
            document.querySelector("#hh").value = "19";
            document.querySelector("#mn").value = "00";
            document.querySelector(".save-timestamp").click();
        },
        ngay,
        thang
    );

    await sleep(4000);
    await page.click("#publish");
    await sleep(1000);
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
            1: 30,
            2: 29,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 20,
            11: 30,
            12: 31,
        };

        for (let i = 0; i < WEBS.length; i++) {
            const web = WEBS[i];

            await loginToWordpress(page, web);
            await page.waitForNavigation();

            for (let d = 1; d <= 3; d++) {
                for (let m = 1; m <= 10; m++) {
                    for (let j = 1; j <= MONTHS[m]; j++) {
                        try {
                            const DOMAIN = d;

                            const date = j;
                            const month = m;
                            const year = 2024;

                            await taoBaiVietSoiCau(
                                web.DOMAIN,
                                page,
                                DOMAIN,
                                date,
                                month,
                                year
                            );
                            await page.waitForNavigation();

                            console.log("Done: " + `${date}-${month}-${year}`);
                        } catch (error) {
                            console.log("Error loop taoBaiViet in: ", `${Constants.Domain[d]}-${m}-${j}`);
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
