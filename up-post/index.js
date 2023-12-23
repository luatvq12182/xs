const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicau7777.mobi",
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
        `${DOMAINS[domain]}-${ngay}-${thang}-${nam}`
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
                Các dự đoán XSMB hôm nay ngày ${date} từ Soi Cầu 7777 cung cấp bộ số Lộc - Phát, giúp anh em nhanh chóng về bờ an toàn. Chúng tôi cam kết các dàn cầu lô đề có độ chính xác 100% và được chia sẻ hoàn toàn miễn phí. Đừng bỏ lỡ cơ hội chốt số với tỷ lệ trúng cao được cung cấp bên dưới. Chúc tất cả anh chị em gặt hái được nhiều thành công.
                
                <img class="alignnone size-full wp-image-538" src="https://soicau7777.mobi/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMB-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />
                
                <h2>Soi cầu 7777 miễn phí xổ số Miền Bắc hôm nay ngày ${date}</h2>

                Nhận ngay dự đoán XSMB miễn phí từ <strong><a href="https://soicau7777.mobi/">Soi Cầu 7777</a></strong> ngay hôm nay! Website chúng tôi thu hút hàng ngàn lượt truy cập mỗi ngày nhờ những dự đoán chính xác cao. Sử dụng phương pháp thống kê và soi cầu thông minh, cung cấp những con số đẹp nhất với tỷ lệ về cao cho bạn vào bờ an toàn.
                
                <div class="table_dudoan_wrapper">
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
                <td>🌟 Bạch thủ đề siêu VIP hôm nay: <span class="number-red">${renderNum(genRandomNumber(4))}</span></td>
                </tr>                
                </tbody>
                </div>

                <h2>Xem lại kết quả XSMB ${dayLabel} tuần rồi ngày ${date}</h2>

                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                <h2>Bảng thống kê KQXS Miền Bắc của Soi Cầu 7777</h2>

                Phương pháp của Soi Cầu 7777 dựa trên việc phân tích chuyên sâu dựa trên thống kê, xu hướng và quy luật xác suất để dự đoán các con số có thể xuất hiện trong kết quả xổ số miền Bắc. Đội ngũ Soi Cầu 7777 cung cấp cho người chơi những con số được xem như là "số đẹp - chính xác nhất" - đó là những con số có khả năng xuất hiện cao dựa trên các tính toán và phân tích khoa học.                

                [thong_ke_general domain="${domain}" ngay="${date}"]

                Soi Cầu 7777 được đánh giá là một trong những trang soi cầu chính xác nhất hiện nay và thu hút sự quan tâm của cả những người có kinh nghiệm lâu năm và những người mới bắt đầu tham gia chơi lô đề, xổ số. Đề xuất anh em nên tham khảo các phương pháp khác để tìm cho mình cặp số may mắn và có cơ hội chiến thắng cao vào ngày hôm đó. CHÚC ANH EM MAY MẮN!                         
                `;
            } else if (+domain === 3) {
                postContent = `
                    Chốt số dự đoán XSMN hôm nay ngày ${date} tại Soi Cầu 7777 được đánh giá cao về tính chính xác và uy tín trong việc dự đoán kết quả xổ số miền Nam. Chúng tôi cung cấp phân tích chi tiết về soi cầu XSMN, dựa trên số liệu thống kê và kinh nghiệm lâu năm trong lĩnh vực này. Hãy tìm hiểu ngay để tăng cơ hội trúng thưởng ngay hôm nay.

                    <img class="alignnone size-full wp-image-538" src="https://soicau7777.mobi/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMN-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />
                    
                    <h2>Tham khảo thống kê KQXS Miền Nam ${dayLabel} tuần trước</h2>

                    [ket_qua_xo_so domain="3" ngay="${date}"]

                    <h2>Chốt số miền Nam miễn phí chuẩn xác hôm nay ${dayLabel}</h2>

                    Soi cầu 7777 XSMN miễn phí được đánh giá cao về tính chính xác và uy tín. Các dự đoán và nhận định được xây dựng dựa trên số liệu thống kê và phân tích chuyên sâu, mang lại thông tin đáng tin cậy cho người chơi. Dưới đây là dự đoán của chúng tôi về KQXSMN có thể về trong hôm nay:   

                    ${provinces
                        .map((prv) => {
                            return `
                            <h3>✅ Soi cầu 7777 chốt số miền Nam đài ${prv} ngày ${date}</h3>
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
                    
                    <h2>Bảng thống kê KQXS Miền Nam từ Soi Cầu 7777</h2>    

                    Để đảm bảo tính chính xác tuyệt đối của soi cầu dự đoán XSMN hôm nay ${date}, Soi Cầu 7777 luôn dựa trên các kết quả xổ số miền Nam từ các kỳ quay trước đó và các thống kê mới nhất để chốt số. Để có dự đoán XSMN hiệu quả ngày hôm nay, chúng tôi mời anh em cùng phân tích các thống kê XSMN mới nhất mà chúng tôi cập nhật dưới đây.
                        
                    [thong_ke_general domain="${domain}" ngay="${date}"] 

                    Trên đây là những kinh nghiệm giúp tăng cơ hội trúng thưởng, nhưng để chọn được con số may mắn chúng ta cần kết hợp nhiều phương pháp soi cầu khác nhau. Mong rằng những kiến thức bổ ích tại Soi Cầu 7777 sẽ giúp bạn phần nào đạt được ước mơ nhanh nhất. Chúc các bạn may mắn.                    
                    `;
            } else {
                postContent = `
                Chốt số Xổ Số Miền Trung hôm nay ngày ${date} tại Soi Cầu 7777 cung cấp thông tin và số liệu tham khảo cho các kỳ quay số tiếp theo của XSMT. Những dự đoán này thường dựa trên phân tích số liệu thống kê, kết quả quay số trước đó và các phương pháp soi cầu dự đoán khác mà chúng tôi tổng hợp lại.

                <img class="alignnone size-full wp-image-538" src="https://soicau7777.mobi/wp-content/uploads/2023/${thang == 12 ? 10 : 12}/XSMT-${ngay}-${thang}${thang == 12 ? "" : `-2024`}.png" alt="" width="1200" height="628" />

                <h2>Soi cầu 7777 chốt số Miền Trung hôm nay ngày ${dayLabel}</h2>

                Soi cầu 7777 Dự Đoán Xổ Số Miền Trung cung cấp kết quả XSMT nhanh nhất và chính xác nhất. Các phần phân tích, soi cầu và dự đoán được tổng hợp hàng ngày từ kết quả các lần quay trước, áp dụng kinh nghiệm đáng giá từ các chuyên gia hàng đầu trong ngành xổ số để đưa ra những con số may mắn có tỷ lệ thắng cao nhất cho anh chị em tham khảo miễn phí.

                ${provinces
                    .map((prv) => {
                        return `
                        <h3>✅ Soi cầu 7777 chốt số Miền Trung miễn phí đài ${prv} ngày ${date}</h3>
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
                    
                <h2>Xem lại KQXS Miền Trung ${dayLabel} tuần trước</h2>   

                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                Khi tham gia dự đoán xổ số miền Trung chính xác 100% tại <strong><a href="https://soicau7777.mobi/">Soi Cầu 7777</a></strong>, có một số điều quan trọng mà người chơi cần hiểu để đảm bảo trải nghiệm an toàn và giảm thiểu rủi ro tài chính. Đầu tiên, hãy nhớ rằng kết quả xổ số hoàn toàn ngẫu nhiên và không thể được dự đoán chính xác 100%. Dù có sử dụng bất kỳ phương pháp dự đoán nào, việc trúng giải vẫn phụ thuộc vào yếu tố may mắn và không có yếu tố nào khác có thể ảnh hưởng.

                <h2>Bảng Thống Kê KQXS Miền Trung của Soi Cầu 7777</h2>

                Việc thống kê XSMT hôm nay bao gồm việc ghi chép và phân tích các kết quả xổ số miền Trung từ nhiều nguồn tin đáng tin cậy như trang web, ứng dụng và các nguồn thông tin khác. Qua quá trình này, có thể tạo ra các dự đoán số đề chuẩn xác. Sử dụng thống kê xổ số miền Trung để dự đoán là một cách thông minh và có độ chính xác cao mà chúng ta có thể thử nghiệm.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]

                Hi vọng thông tin hữu ích từ Soi cầu 7777 sẽ giúp bạn chọn được những con số may mắn nhất trong ngày. Những dự đoán từ Soi Cầu Lô Đề Chuẩn Xác chỉ mang tính chất tham khảo. CHÚC ANH EM MAY MẮN!
                `;
            }

            if (domain == 1) {
                document.querySelector("#title").value = `Soi Cầu 7777 – Chốt Số Miền Bắc Hôm Nay ${date} Chính Xác`;
            }

            if (domain == 3) {
                document.querySelector("#title").value = `Soi Cầu 7777 – Chốt Số Miền Nam Hôm Nay ${date} Trúng Lớn`;
            }

            if (domain == 2) {
                document.querySelector("#title").value = `Soi Cầu 7777 – Chốt Số Miền Trung Hôm Nay ${date} Miễn Phí`;
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
        async (ngay, thang, nam) => {
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
            document.querySelector("#aa").value = nam;
            document.querySelector("#hh").value = "19";
            document.querySelector("#mn").value = "00";
            document.querySelector(".save-timestamp").click();
        },
        ngay,
        thang,
        nam
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
                for (let m = 1; m <= 1; m++) {
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
