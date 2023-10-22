const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://rongbachkim666.me",
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
        `https://rongbachkim666.me/wp-admin/post-new.php?post_type=${post_type[domain]}`,
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
                Chào mừng bạn đến với soi cầu dự đoán kết quả Xổ Số Miền Bắc (XSMB) hôm nay ngày ${date}, nơi bạn có cơ hội nhận những con số may mắn với sự chắc chắn và hoàn toàn miễn phí! Rồng Bạch Kim 666 tự hào mang đến cho bạn những dự đoán XSMB chất lượng và chính xác nhất, giúp bạn chốt số trúng thưởng giải đặc biệt, lô 2 số, 3 càng và lô xiên một cách hiệu quả.

                [caption id="attachment_547" align="alignnone" width="1200"]<img class="alignnone size-full wp-image-547" src="https://rongbachkim666.me/wp-content/uploads/2023/10/${domainLabel}-${ngay}-${thang}.png" alt="" width="1200" height="628" /> Hình ảnh Rồng Bạch Kim 666 Soi Cầu Dự Đoán Kết Quả ${domainLabel} ${date}[/caption]
                <h2>Bảng thống kê KQXS Miền Bắc của Rồng Bạch Kim 666</h2>
                Soi cầu dự đoán XSMB ngày ${date} của chúng tôi không chỉ dựa trên may mắn mà còn dựa trên cơ sở thống kê số học và phân tích sâu rộng. <strong><a href="https://rongbachkim666.me/">Rồng Bạch Kim 666</a></strong> tập trung vào việc cung cấp cho bạn những con số có khả năng trúng thưởng cao nhất, từ đặc biệt đầu đuôi đến các lô tô và lô xiên. Chúng tôi cam kết cung cấp thông tin chính xác và dự đoán XSMB hôm nay theo tính chuẩn xác cao nhất để giúp bạn có cơ hội trúng lớn.
                
                <h2>Cùng xem lại kết quả ${domainLabel} ${dayLabel} tuần rồi ngày ${ngayTuanTruocLabel}</h2>
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                [thong_ke_general domain="1" ngay="${date}"]  

                <h2>Soi cầu Rồng Bạch Kim 666 xổ số Miền Bắc hôm nay ngày ${date}</h2>
                Bên cạnh việc thống kê kết quả XSMB, bằng cách phân tích các mô hình số học chúng tôi đã chọn được các thông tin bổ ích và cầu kèo đẹp để đưa ra những con số chuẩn xác nhất hôm nay ngày ${date}. RBK 666 luôn sẵn sàng hỗ trợ bạn trong việc tìm ra những con số lô, số đề đẹp nhất để đảm bảo bạn gặp được nhiều may mắn mỗi ngày.
                <h3>Soi cầu dự đoán kết quả xổ số Miền Bắc ngày ${date}</h3>
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
                <td>🌟 Bạch thủ đề siêu VIP hôm nay: <span class="number-red">${renderNum(genRandomNumber(
                    4
                ))}</span></td>
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
                <h3>Soi cầu XSMB chính xác hôm nay ${date}</h3>
                Hãy luôn luôn theo dõi Rồng Bạch Kim 666 để cập nhật các dự đoán và chốt số XSMB hàng ngày chính xác. Chúng tôi hy vọng rằng bạn sẽ có nhiều may mắn trong việc trúng giải cao và đạt được những giấc mơ của mình thông qua bảng kết quả Xổ Số Miền Bắc sẽ về hôm nay!
                
                </div>                
                `;
            } else if (+domain === 3) {
                postContent = `
                Hãy cùng Rồng Bạch Kim 666 soi cầu dự đoán kết quả Xổ Số Miền Nam (${domainLabel}) hôm nay ngày ${date} với sự chính xác cao và chi tiết nhất. Tại đây, chúng tôi cam kết đem đến cho bạn những con số đẹp nhất và có tỉ lệ về cao nhất để bạn có nhiều cơ hội đổi đời.

                [caption id="attachment_547" align="alignnone" width="1200"]<img class="alignnone size-full wp-image-547" src="https://rongbachkim666.me/wp-content/uploads/2023/10/${domainLabel}-${ngay}-${thang}.png" alt="" width="1200" height="628" /> Hình ảnh Rồng Bạch Kim 666 Soi Cầu Dự Đoán Kết Quả ${domainLabel} ${date}[/caption]
                <h2>Bảng thống kê KQXS Miền Nam ${dayLabel} tuần trước của Rồng Bạch Kim 666</h2>
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Soi cầu ${domainLabel} chuẩn xác hôm nay ${date} tại RBK 666 không chỉ phụ thuộc vào sự may mắn, mà được xây dựng trên cơ sở phân tích dữ liệu đã có và kiến thức đáng tin cậy. Ngoài ra, chúng tôi liên tục cập nhật thông tin và thống kê kết quả trước đây, giúp bạn hiểu rõ hơn về các xu hướng số học sẽ ra trong bảng kết quả ${domainLabel} sẽ ra hôm nay.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                
                Dự đoán Xổ Số Miền Nam ngày ${date} được chia sẻ bởi những chuyên gia <strong><a href="https://rongbachkim666.me/">Rồng Bạch Kim 666</a></strong> có chuyên môn và kinh nghiệm trong lĩnh vực soi cầu xổ số. Với sự cẩn trọng và kiểm chứng kỹ lưỡng cùng những thống kê chính xác từ kết quả xổ số các kì quay trước, chúng tôi đưa ra những con số có khả năng trúng giải cao nhất, giúp những ai đang loạn số tìm được cho mình những con số may mắn.
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

                <h2>Soi cầu dự đoán ${domainLabel} chính xác hôm nay</h2>
                Rồng Bạch Kim 666 mong rằng những thông tin và soi cầu ${domainLabel} của chúng tôi sẽ đồng hành cùng bạn trong quá trình chơi xổ số, mang lại cho bạn niềm vui và hy vọng vào việc giành được những phần thưởng hấp dẫn từ kết quả Xổ Số Miền Nam hôm nay ${date}. Hãy luôn kết nối với chúng tôi để cập nhật những dự đoán và chốt số chính xác nhất. Đừng để bất kỳ cơ hội nào có thể thay đổi cuộc đời bạn trôi qua một cách vô nghĩa.
                
                </div>                
                `;
            } else {
                postContent = `
                Soi cầu dự đoán kết quả Xổ Số Miền Trung (XSMT) ngày hôm nay ngày ${date} với sự tỉ mỉ và chính xác. Rồng Bạch Kim 666 sẽ giúp bạn chốt số lô giải tám, giải đặc biệt và bao lô 2 số chính xác nhất cho các đài <strong>${provinces.join(
                    ", "
                )}</strong> xổ số Miền Trung hôm nay.
                
                [caption id="attachment_547" align="alignnone" width="1200"]<img class="alignnone size-full wp-image-547" src="https://rongbachkim666.me/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="" width="1200" height="628" /> Hình ảnh Rồng Bạch Kim 666 Soi Cầu Dự Đoán Kết Quả ${domainLabel} ${date}[/caption]                
                <h2>Bảng thống kê KQXS Miền Trung ${dayLabel} tuần trước của Rồng Bạch Kim 666</h2>
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Soi cầu dự đoán XSMT hôm nay ${date} của chúng tôi không chỉ là kết quả của sự may mắn mù quáng, mà nó dựa trên phân tích chuyên sâu. <strong><a href="https://rongbachkim666.me/">Rồng Bạch Kim 666</a></strong> đã tận dụng sự hiểu biết và kiến thức về xổ số Miền Trung để đưa ra các con số có khả năng trúng thưởng cao nhất hàng ngày. Các chuyên gia chúng tôi luôn cập nhật thông tin và thống kê kết quả trước đây để giúp bạn có cái nhìn rõ ràng hơn về những con số sẽ về trong bảng kết quả xổ số miền Trung ngày ${date}.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                <h2>Soi cầu Rồng Bạch Kim 666 xổ số Miền Trung hôm nay ngày ${date}</h2>
                Hãy cùng chuyên gia hàng đầu tại Rồng Bạch Kim 666 khám phá kết quả soi cầu xổ số Miền Trung ngày ${date} một cách siêu chính xác, với sự chắc chắn trong việc dự đoán giải tám, giải đặt biệt và bảo lô 2 số nên mọi người hoàn toàn yên tâm khi tham khảo các con số chúng tôi đưa ra dưới đây:
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
                <h2>Soi cầu dự đoán XSMT chính xác hôm nay ${date}</h2>
                Rồng Bạch Kim 666 hi vọng rằng thông tin và dự đoán KQXSMT của chúng tôi sẽ giúp bạn có trải nghiệm thú vị và có cơ hội giành được những giải thưởng hấp dẫn từ kết quả XS Miền Trung hôm nay. Hãy theo dõi chúng tôi để không bỏ lỡ bất kỳ thông tin quan trọng nào về những thông tin soi cầu XSMT.
                </div>
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Rồng Bạch Kim 666 Soi Cầu Dự Đoán Kết Quả ${domainLabel} ${date}`;
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

            const DOMAIN = Constants.Domain.MienBac;

            for (let m = 10; m <= 12; m++) {
                for (let j = 1; j <= MONTHS[m]; j++) {
                    try {
                        const date = j;
                        const month = m;
                        const year = 2023;

                        await taoBaiVietSoiCau(page, DOMAIN, date, month, year);

                        console.log("Done: " + `${date}-${month}-${year}`);
                    } catch (error) {
                        console.log("Error loop taoBaiViet", error);
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
