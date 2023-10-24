const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicau6666.info",
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
        `${DOMAINS[domain]}-${ngay}-${thang}`
    );

    await sleep(6000);

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
                Thay mặt các chuyên gia tại Soi Cầu 6666 hôm nay Chung sẽ chia sẻ tới các Anh Em miền Bắc những con số may mắn nhất. Hi vọng rằng với những con số may mắn này sẽ giúp các bạn có 1 ngày tài lộc tiền vào như nước. Tất nhiên mọi thông tin được chúng tôi đưa ra hãy chỉ mang tính chất tham khảo còn quyết định sẽ nằm ở các bạn.
                
                [caption id="attachment_551" align="alignnone" width="1200"]<img class="size-full wp-image-551" src="https://soicau6666.info/wp-content/uploads/2023/10/XSMB-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 6666 Nhận Định KQXS MB Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 6666 Nhận Định KQXS MB Hôm Nay ${date}[/caption]
                
                Xem lại KQXS Miền Bắc hôm qua Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
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
                
                Dưới đây là những thống kê đến từ Soi Cầu 6666. Những người Anh Em chơi lô đề đã lâu chắc chắn sẽ rất thích những bảng thông kê mang lại những số liệu hữu ích cho Anh Em.

                [thong_ke_general domain="${domain}" ngay="${date}"]
                </div>                
                `;
            } else if (+domain === 3) {
                postContent = `
                    Với những Dự đoán KQXS Miền Nam giúp cho rất nhiều các Anh Em về bờ. Hôm nay các chuyên gia tại Soi Cầu 6666 tiếp tục cập nhật cho các bạn những con số may mắn để giúp Anh Em ăn đậm 3 đài TP. HCM, Đồng Tháp, Cà Mau. Hi vọng rằng với những đóng góp không ngừng và chia sẻ hoàn toàn miễn phí sẽ giúp mọi người có một cuộc sống sung túc đầy đủ hơn.

                    [caption id="attachment_573" align="alignnone" width="1200"]<img class="size-full wp-image-573" src="https://soicau6666.info/wp-content/uploads/2023/10/XSMN-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 6666 Dự Đoán KQXS Miền Nam Ngày ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 6666 Dự Đoán KQXS Miền Nam Ngày ${date}[/caption]
                    
                    Xem lại KQXS Miền Nam vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                    
                    [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                    
                    Dưới đây là những Dự đoán của chúng tôi, người chơi có thể tham khảo.

                    ${provinces
                        .map((prv) => {
                            return `
                            <h3>✅ Soi cầu dự đoán kết quả xổ số ${prv} ngày ${date}</h3>
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
                    
                    Những con số Thống kê chắc chắn sẽ giúp cho những người Anh Em có thêm tính toàn và tự tin vào sự lựa chọn của mình. Cùng tra lại các Bảng Thống kê dưới đây để nắm chắc phần thắng trong tay mình nhé.
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]         
                    `;
            } else {
                postContent = `
                Tiếp tục với những con số may mắn dành cho những người Anh Em nghiện chơi lô đề tại Miền Trung. Hôm nay các chuyên gia tại Soi Cầu 6666 sẽ tiếp tục Dự đoán KQXS của đài ${provinces.join(', ')} ngày ${date}.

                [caption id="attachment_546" align="alignnone" width="1200"]<img src="https://soicau6666.info/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 6666 Dự Đoán KQXS Miền Trung Ngày ${date}" width="1200" height="628" class="size-full wp-image-546" /> Hình ảnh Soi Cầu 6666 Dự Đoán KQXS Miền Trung Ngày ${date}[/caption]                
                
                Xem lại KQXS Miền Trung vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                Hi vọng rằng những Dự đoán của chúng tôi về KQXS MT sẽ giúp cho các bạn trúng đậm.       
                
                ${provinces
                    .map((prv) => {
                        return `
                        <h3>✅ Soi cầu dự đoán xổ số ${prv} ngày ${date}</h3>
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
                
                Ngoài việc tham khảo những con số đẹp ngày hôm nay các bạn cũng có thể xem thêm các Bảng Thống Kê của Soi Cầu 6666. Chúng tôi luôn khuyến khích các Anh Em tự soi các con số thống kê để rút kinh nghiệm cho bản thân mình và đưa ra các phương án chơi hợp lý.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Soi Cầu 6666 Nhận Định KQXS ${
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

    await sleep(1000);

    await page.evaluate(
        async (ngay, thang) => {
            document.querySelector(".edit-timestamp").click();
            document.querySelector("#jj").value = ngay;
            document.querySelector("#mm").value = thang;
            document.querySelector("#hh").value = "01";
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
                            await page.waitForNavigation();

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
