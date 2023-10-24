const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicau568.us",
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
                Bằng những kinh nghiệm cũng như công cụ thống kê, phân tích bảng kết quả xổ số trước đó <strong>Soi Cầu 568</strong> có thể tạo ra cặp số may mắn, chuẩn xác cho các Anh Em miền Bắc tham khảo.

                [caption id="attachment_536" align="alignnone" width="1200"]<img class="size-full wp-image-536" src="https://soicau568.us/wp-content/uploads/2023/10/XSMB-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MB Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MB Hôm Nay ${date}[/caption]
                
                Xem lại KQXS Miền Bắc ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Đối với những chuyên gia trong lĩnh vực xổ số có nhiều kinh nghiệm họ thường áp dụng các phương pháp, tính toán xác suất thống kê. Từ đó đưa ra quy luật thông qua bảng kết quả của kỳ trước với mục đích chọn ra cặp số lô có tỷ lệ trúng cao nhất trong ngày hôm nay.
                
                Theo cách soi cầu, phân tích từ Soi Cầu 568 người chơi có thể tham khảo các cầu kèo dưới đây:

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
                Cách soi cầu xổ số miền Bắc dựa trên cách phân tích, nhận định cũng như áp dụng chiến thuật để tăng khả năng chiến thắng. Ngoài các phương pháp soi cầu được đúc rút kinh nghiệm qua các năm thì chúng tôi còn giựa vào các bảng thống kê để lựa chọn các con số có tỉ lệ trúng cao.
                [thong_ke_general domain="${domain}" ngay="${date}"]
                </div>                
                `;
            } else if (+domain === 3) {
                postContent = `
                    Với những bí kíp soi cầu chuẩn từ các chuyên gia của <strong>Soi Cầu 568</strong>, Anh Em có thể dễ dàng tìm kiếm và lựa chọn cho mình những cặp số may mắn giải miền Nam. Hệ thống sở hữu công cụ phân tích cộng thêm đội ngũ chuyên gia giàu kinh nghiệm hứa hẹn mang đến may mắn tài lộc cho bạn.

                    [caption id="attachment_543" align="alignnone" width="1200"]<img class="size-full wp-image-543" src="https://soicau568.us/wp-content/uploads/2023/10/XSMN-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MN Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MN Hôm Nay ${ngay}-${thang}-2023[/caption]
                    
                    Xem lại KQXS Miền Nam vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                    
                    [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                    
                    Phương pháp cho số miền Nam thông qua việc phân tích kết quả, xác định con số xuất hiện nhằm đưa ra dự đoán chuẩn xác nhất. Soi Cầu 568 cung cấp các phương pháp như soi cầu đưa ra các kết quả giải tám, giải đặc biệt hoặc bao lô. Từ đó người chơi khi tham gia sẽ có được đa dạng sự lựa chọn.
                    
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
                    
                    Soi Cầu 568 sở hữu hệ thống chuyên gia chuyên soi cầu, dự đoán kết quả xổ số miền Nam. Tất cả mang đến người chơi lợi ích giá trị dựa vào kết quả bảng trả thưởng trong nhiều lần quay. Đồng thời tổng hợp các dữ liệu với các bảng thống kê chính xác.

                    Để đưa ra quyết định lựa chọn con số lô đẹp người chơi cần tham khảo bảng quay thưởng của những kỳ gần nhất. Bên cạnh đó so sánh, thống kê các con số may mắn đồng thời nuôi trong các kỳ tiếp theo để có thể vào bờ ngay lập tức.
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]         
                    `;
            } else {
                postContent = `
                Soi Cầu 568 chia sẻ miễn phí đến thành viên bảng soi cầu lô đề miền Trung từng ngày. Anh em khi truy cập vào website soicau568.us có thể tham khảo, dự đoán con số lô đẹp ${date} từ chuyên gia lâu năm. Chắc chắn với những công cụ, phương pháp soi cầu bạn sẽ có được cơ hội ăn lô, ăn đề cao nhất.

                [caption id="attachment_576" align="alignnone" width="1200"]<img class="size-full wp-image-576" src="https://soicau568.us/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MT Hôm Nay ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu 9999 Dự Đoán KQXS MT Hôm Nay ${ngay}-${thang}-2023[/caption]
                
                Xem lại KQXS Miền Trung vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
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
                
                Vai trò của cho số miền Trung vô cùng quan trọng ảnh hưởng đến chiến thắng của bạn nên việc soi cầu, dự đoán con số lô là vô cùng cần thiết. Soi Cầu 568 chính là đơn vị uy tín cho người chơi tham khảo nhận định, soi cầu, dự đoán KQXS MT chuẩn. Chúng tôi tập hợp các chuyên gia giàu kinh nghiệm có kiến thức chuyên sâu về lĩnh vực lô đề.

                <strong>Soi Cầu 568</strong> hiện đang là kênh soi cầu hoàn toàn miễn phí dành cho tín đồ đam mê số học. Anh em khi lựa chọn có thể đối chiếu với bảng thống kê của chúng tôi để quyết định xuống tiền con số nào.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Soi Cầu 568 Dự Đoán Kết Quả ${domainLabel} Ngày ${date}`;
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
    await page.waitForNavigation();
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

            for (let d = 3; d <= 3; d++) {
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
