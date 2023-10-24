const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://soicauvip888.info",
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
                Soi Cầu VIP 888 thông qua một số phương pháp thống kê, phân tích, soi cầu giúp anh em có được những cặp số chuẩn xác áp dụng nhiều cách chơi khác nhau với mục đích tăng khả năng chiến thắng.

                Theo cách chuyên gia từ Soi Cầu VIP 888 mỗi con số xuất hiện trong bảng kết quả xổ số sẽ có một quy luật riêng. Đội ngũ chuyên gia với thời gian hoạt động lâu năm tại hệ thống liên tục cập nhật, nghiên cứu để đưa ra được quy luật cũng như cách soi cầu, dự đoán con số may mắn, chuẩn xác nhất.

                [caption id="attachment_564" align="alignnone" width="1200"]<img class="size-full wp-image-564" src="https://soicauvip888.info/wp-content/uploads/2023/10/XSMB-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Bắc Ngày ${ngay}-${thang}-${nam}" width="1200" height="628" /> Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Bắc Ngày ${date}[/caption]
                
                Xem lại KQXS Miền Bắc hôm qua Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                
                Cầu lô xổ số miền Bắc là sự kết hợp giữa các vị trí bất kỳ trong bảng trả thưởng. Chính vì thế cách soi cầu lô chính là cách kiểm tra, xem xét diễn biến việc ghép nối chính xác. Thông qua bảng kết quả xổ số hàng ngày được lưu trữ, thống kê kết hợp thêm các thuật toán xác suất Soi Cầu VIP 888 đã phân tích ra những con số may mắn. Đặc biệt tất cả kết quả dự đoán tại hệ thống đều miễn phí giúp người chơi tham khảo dễ dàng.
                
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
                Người chơi khi tham gia xổ số miền Bắc cần phải theo dõi, tìm hiểu bảng kết quả trong những kỳ gần nhất. Bên cạnh đó áp dụng những phương pháp soi cầu, nhận định, thống kê để có dự đoán nhanh chóng về cặp số lô tài lộc.
                [thong_ke_general domain="${domain}" ngay="${date}"]
                Soi Cầu VIP 888 sở hữu đội ngũ chuyên gia, công cụ phân tích hiệu quả chắc chắn sẽ là điểm đến lý tưởng giúp anh em lựa chọn được những con số tăng khả năng về bờ nhanh chóng.
                </div>                
                `;
            } else if (+domain === 3) {
                postContent = `
                    Các bạn đã từng chơi Lô Đề giải Miền Nam mà chưa bao giờ trúng liền 3 - 7 hoặc 10 ngày liên tiếp. Vậy thì hãy tham khảo các con số của chúng tôi, Soi Cầu VIP 888 dựa các phương pháp Soi Cầu độc để phân tích để tìm ra những con số đẹp và may mắn mang lại cơ hội chiến thắng cao cho các bạn.

                    [caption id="attachment_573" align="alignnone" width="1200"]<img class="size-full wp-image-573" src="https://soicauvip888.info/wp-content/uploads/2023/10/XSMN-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Nam Ngày ${date}" width="1200" height="628" /> Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Nam Ngày ${date}[/caption]
                    
                    Xem lại KQXS Miền Nam vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                    
                    [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]
                    
                    Trong bảng kết quả xổ số miền Nam có rất nhiều con số xuất hiện theo một quy luật. Nếu tìm hiểu kỹ càng cộng thêm công cụ, phần mềm được sử dụng tại Soi Cầu VIP 888 anh em sẽ có được con số sử dụng nuôi trong những ngày tiếp theo phù hợp nhất.
                    
                    Khi nắm bắt được quy luật anh em có thể dự đoán dễ dàng kết quả xổ số miền Nam chính xác nhất. Hệ thống Soi Cầu VIP 888 mang đến người chơi những bí kíp, chia sẻ bởi chuyên gia hàng đầu giúp bạn có được những con số tài lộc. Cùng xem dự đoán của chúng tôi hôm nay nhé.

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
                    
                    Nếu muốn tăng cao phần trăm chiến thắng anh em có thể theo dõi các Bảng thống kê của chúng tôi. Đồng thời phân tích, soi cầu con số có xác suất trả về ở những kỳ quay tiếp theo hiệu quả tuyệt đối.
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]         
                    `;
            } else {
                postContent = `
                Soi Cầu VIP 888 thực hiện quá trình soi cầu giúp người chơi chọn ra được con số đẹp tăng cao cơ hội chiến thắng. Đây là bước vô cùng cần thiết, quan trọng được đội ngũ chuyên gia quan tâm với mục đích tạo ra các cặp số may mắn nhất trong ngày gửi tới các Anh Em.

                [caption id="attachment_546" align="alignnone" width="1200"]<img src="https://soicauvip888.info/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Trung Ngày ${date}" width="1200" height="628" class="size-full wp-image-546" /> Hình ảnh Soi Cầu VIP 888 Dự Đoán KQXS Miền Trung Ngày ${date}[/caption]                
                
                Xem lại KQXS Miền Trung vào ${dayLabel} tuần trước Ngày ${ngayTuanTruocLabel}
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                Để có thể dự đoán cặp số khả năng trả về cao nhất bạn cần theo dõi bảng kết quả miền Trung trong khoảng 30 ngày liên tiếp. Đồng thời thống kê, phân tích giải đặc biệt theo các ngày trong tuần để tạo con số đẹp. Kết hợp thêm kinh nghiệm soi cầu từ chuyên gia Soi Cầu VIP 888 chắc chắn bạn sẽ có được dàn số xác suất trả về cao để thử sức.

                Chúng tôi sở hữu đội ngũ chuyên gia liên tục nghiên cứu, tổng hợp các con số cho người chơi tham khảo. Kết quả tại hệ thống cũng được đánh giá về tính hiệu quả và độ chính xác. Anh em có thể tin tưởng lựa chọn các cặp số dưới đây để có vể về bờ nhanh chóng nhất.                
                
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
                
                Đặc biệt các kỳ quay của xổ số miền Trung được chia thành các tỉnh thành theo các ngày, tuy hơi khó nhưng các chuyên gia vẫn có thể tính được. Các phương pháp Soi cầu được áp dụng cộng thêm công cụ, phần mềm hiện đại chính là mang lại chiến thắng cho mọi người. Ngoài ra đối chiếu với những Bảng thống kê bên dưới cùng giúp chúng ta loại bỏ đi những con số ít có khả năng về trong ngày hôm nay.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]
                `;
            }

            document.querySelector(
                "#title"
            ).value = `Soi Cầu VIP 888 Dự Đoán KQXS Miền ${
                domain == 1 ? "Bắc" : domain == 2 ? "Trung" : "Nam"
            } Ngày ${date}`;
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

            for (let d = 1; d < 3; d++) {
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
