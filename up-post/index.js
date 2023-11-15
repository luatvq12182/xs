const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const WEBS = [
    {
        DOMAIN: "https://rongbachkim777.me",
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
                RBK 777 là một phương pháp soi cầu Miền Bắc dành cho việc thống kê và phân tích kết quả xổ số hôm nay ngày ${date}, giúp bạn tìm ra những con số may mắn với khả năng trúng thưởng cao nhất. Với nhiều năm soi cầu chuyên nghiệp, đội ngũ chuyên gia của <strong><a href="https://rongbachkim777.me/">Rồng Bạch Kim 777</a></strong> hứa hẹn sẽ mang đến cho anh chị em những dàn cầu lô đề đẹp và chính xác nhất và hoàn toàn miễn phí.
                
                [caption id="attachment_531" align="alignnone" width="1200"]<img class="size-full wp-image-531" src="https://rongbachkim777.me/wp-content/uploads/2023/10/XSMB-${ngay}-${thang}.png" alt="Hình ảnh Rồng Bạch Kim Dự Đoán KQXS Miền Bắc ${date}" width="1200" height="628" /> Hình ảnh Rồng Bạch Kim 777 Dự Đoán KQXS Miền Bắc ${date}[/caption]
                
                <h2>Cùng xem lại kết quả XSMB Thứ 2 tuần rồi ngày ${ngayTuanTruocLabel}</h2>
                Trong phương pháp soi cầu Rồng Bạch Kim 777 này, người chơi cần sử dụng kết quả xổ số của ngày trước đó làm căn cứ để tiến hành phân tích và dự đoán con số có thể xuất hiện trong kết quả xổ số ngày tiếp theo. Để soi cầu KQXS hôm nay ngày ${date} chúng ta cùng xem lại bảng kết quả xổ số Miền Bắc thứ 2 tuần vừa rồi:
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                <h2>✅ Rồng Bạch Kim 777 soi cầu dự đoán XSMB ngày ${date}</h2>
                Dựa vào bảng thống kê KQXS kỳ quay trước, đội ngũ chuyên gia chúng tôi đã dày công nghiên cứu để đưa ra các cầu số lô đề đẹp dưới đây cho anh chị em tham khảo:

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
                <strong>Chú ý:</strong> <span style="color: #ff0000;">Chúng tôi muốn lưu ý rằng phần chốt số từ các cao thủ hàng đầu ở đây được chia sẻ hoàn toàn miễn phí với mục tiêu hỗ trợ người chơi xổ số tối ưu hóa cơ hội trúng thưởng và không khuyến khích sử dụng để đánh lô đề. Chúng tôi chúc bạn may mắn và giành được những giải thưởng lớn nhất trong ngày hôm nay.</span>
                </div>

                <h2>Thống kê chi tiết KQXS Miền Bắc ngày ${date}</h2>
                Để có những cầu số lô đề đẹp ngày ${date} mà Rồng Bạch Kim 777 đưa ra ở trên thì các chuyên gia chúng tôi phải bám sát vào các thống kê của những chu kỳ quay trước. Dưới đây là những thống kê mà mọi người có thể xem qua và đưa ra cho mình những kết quả chắc chắn hơn.

                [thong_ke_general domain="${domain}" ngay="${date}"]

                Cập nhật thống kê soi cầu XSMB ngày ${date} tại RBK 777 sẽ giúp bạn tìm ra những con số chính xác nhất để chơi. Dự đoán kết quả xổ số miền Bắc hôm nay đã được chuyên gia Rồng Bạch Kim 777 thực hiện bằng cách phân tích thống kê kết quả từ nhiều kỳ trước, cùng với việc áp dụng những phương pháp soi cầu độc đáo. Chúng tôi rất vui khi chia sẻ thông tin này và cung cấp số miễn phí để tăng khả năng thắng cuộc đến với mọi người. Chúc các bạn có một trải nghiệm chơi thú vị và gặt hái những phần thưởng lớn!                
                `;
            } else if (+domain === 3) {
                postContent = `
                    Nếu bạn đang tìm kiếm con số may mắn cho hôm nay ngày ${date}, hãy tham khảo bài viết dưới đây để đảm bảo sự chắc chắn hơn. Bằng những kinh nghiệm quý báu từ đội ngũ soi cầu Miền Nam của Rồng Bạch Kim 777 chúng tôi sẽ gợi ý cho các bạn những cầu số đẹp nhất.

                    Đối với các người chơi mới, phương pháp dự đoán xổ số Miền Nam này có thể là một khám phá đầy thú vị. Tuy nhiên, khi bạn cố gắng nghiên cứu sâu hơn sẽ nhận ra rằng nó thực sự rất đơn giản và rất chính xác.

                    [caption id="attachment_566" align="alignnone" width="1200"]<img class="size-full wp-image-566" src="https://rongbachkim777.me/wp-content/uploads/2023/10/XSMN-${ngay}-${thang}.png" alt="Hình ảnh RBK 777 Dự Đoán KQXS Miền Nam ${date}" width="1200" height="628" /> Hình ảnh RBK 777 Dự Đoán KQXS Miền Nam ${date}[/caption]
                    
                    <h2>Cùng Rồng Bạch Kim 777 lại kết quả XSMN ${dayLabel} tuần rồi ngày ${ngayTuanTruocLabel}</h2>
                    
                    [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                    ${provinces
                        .map((prv) => {
                            return `
                            <h3>✅ Rồng Bạch Kim 777 soi cầu kết quả xổ số ${prv} ngày ${date}</h3>
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
                        
                    <strong>**Xin lưu ý:</strong> Các cặp số đẹp ngày ${date} (${dayLabel}) trên trang <strong><a href="https://rongbachkim777.me/">Rồng Bạch Kim 777</a></strong> dự đoán chỉ được cung cấp cho mục đích tham khảo. Chúng tôi khuyến cáo mọi người xem xét kỹ trước khi chơi và không nên tham gia đánh lô đề vì việc này là bất hợp pháp. Thay vào đó, chúng ta nên tham gia Loto do nhà nước phát hành để vừa giải trí vừa góp phần vào lợi ích quốc gia và cộng đồng.
                    
                    Hơn nữa, các bạn cũng có thể tìm hiểu thêm thông tin và các thống kê kết quả XSMN từ chúng tôi để tăng cơ hội chiến thắng:
                    
                    [thong_ke_general domain="${domain}" ngay="${date}"]    
                    
                    Bài viết này là một tài liệu tham khảo hoàn toàn miễn phí để người chơi có thể dự đoán kết quả xổ số Miền Nam hôm nay, đặc biệt là những con số may mắn trong bảng kết quả XSMN ${dayLabel} ngày ${date}. Bằng việc sử dụng thống kê về dự đoán kết quả cầu lô và thống kê kết quả XS Miền Nam trong ngày hôm nay, chúng tôi hy vọng rằng các bạn sẽ tìm được những con số chính xác nhất. Chúc các bạn may mắn!                    
                    `;
            } else {
                postContent = `
                Dự đoán kết quả xổ số miền Trung miễn phí hôm nay ${date} là sự lựa chọn hoàn hảo cho những người yêu thích lĩnh vực "số học," nhưng không có đủ thời gian hoặc phương pháp nghiên cứu. Chúng tôi cập nhật và phân tích dự đoán KQXS miền Trung với số liệu thống kê chi tiết từ nhiều góc độ khác nhau mỗi ngày. Dựa trên những thông tin này, các cao thủ soi cầu của chúng tôi sẽ gửi đến các bạn những cặp số may mắn có xác suất về cao nhất và hoàn toàn miễn phí để bạn tham khảo.

                [caption id="attachment_557" align="alignnone" width="1200"]<img class="size-full wp-image-557" src="https://rongbachkim777.me/wp-content/uploads/2023/10/XSMT-${ngay}-${thang}.png" alt="Hình ảnh RBK 777 Dự Đoán KQXS Miền Trung ${date}" width="1200" height="628" /> Hình ảnh RBK 777 Dự Đoán KQXS Miền Trung ${date}[/caption]
                
                <h2>Cùng xem lại kết quả XSMT ${dayLabel} kỳ quay trước:</h2>
                
                [ket_qua_xo_so domain="${domain}" ngay="${ngayTuanTruocLabel}"]

                <h2>Chốt cầu đẹp Miền Trung chính xác hôm nay ngày ${date}</h2>
                Dự đoán kết quả xổ số miền Trung ngày hôm nay ${date} của các cao thủ soi cầu <strong><a href="https://rongbachkim777.me/">Rồng Bạch Kim 777</a></strong> là kết quả chính xác được dựa trên số liệu thống kê của KQXSMT và những phân tích cẩn thận, phương pháp soi cầu độ chính xác cao giúp người chơi tham khảo các con số may mắn nhất mà chúng tôi đã chọn lọc

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
                
                Cần lưu ý rằng những cặp số này được chúng tôi chia sẻ hoàn toàn miễn phí hàng ngày. Chúng tôi cập nhật số Lô và Đề liên tục đều đặt hàng ngày, tuy nhiên mọi thông tin chỉ mang tính tham khảo. Các bạn cần đọc thêm <a href="https://rongbachkim777.me/dieu-khoan/" target="_blank" rel="noopener">Điều khoản</a> từ chúng tôi để có cái nhìn khách quan nhất.
                
                <h2>Tham khảo bảng thống kê XSMT của Rồng Bạch Kim 777</h2>
                
                Dựa vào bảng kết quả xổ số miền Trung của 30 ngày gần đây, chúng ta có thể dễ dàng nhận thấy sự biến động rõ rệt trong các con số, bao gồm những con lô thường xuyên về, những con lô có tần suất xuất hiện cao, và tất cả các cặp số.
                Nếu bạn là người thường xuyên chơi bạch thủ hoặc song thủ lô, thì có lẽ nên loại trừ những con lô thường xuyên về hoặc chỉ xem xét những con lô về thường xuyên. Thay vào đó, hãy tập trung vào các con lô có tần suất về đều đặn, kết hợp với việc sử dụng các kinh nghiệm soi cầu chuẩn xác để đưa ra dự đoán về kết quả XSMT ngày ${date} cuối cùng với xác suất cao nhất.
                
                [thong_ke_general domain="${domain}" ngay="${date}"]

                Việc tham khảo dự đoán số lô đề miền Trung hôm nay miễn phí giúp người chơi tiết kiệm thời gian và công sức trong việc tổng hợp và phân tích số liệu, đồng thời chọn ra được một dàn lô chuẩn xác. Tuy nhiên, cần lưu ý rằng việc soi cầu XSMT không thể đảm bảo độ chính xác tuyệt đối 100%. Do đó, việc tham khảo thông tin từ Rồng Bạch Kim 777 là một cách tốt để nắm bắt cầu lô nào đang hot và các bộ số mà nhiều người đang quan tâm.
                `;
            }

            if (domain == 1) {
                document.querySelector("#title").value = `Rồng Bạch Kim 777 Soi Cầu Miền Bắc Hôm Nay Ngày ${date}`;
            }

            if (domain == 3) {
                document.querySelector("#title").value = `Rồng Bạch Kim 777 chốt số Miền Nam chuẩn xác ngày ${date}`;
            }

            if (domain == 2) {
                document.querySelector("#title").value = `Rồng Bạch Kim 777 cầu đẹp Miền Trung chính xác ngày ${date}`;
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
                9: 30,
                10: 31,
                11: 30,
                12: 31,
            };

            document.querySelector(".edit-timestamp").click();
            document.querySelector("#jj").value = (+ngay > 1) ? (+ngay - 1) : MONTHS[+thang - 1];
            document.querySelector("#mm").value = thang;
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
            10: 31,
            11: 30,
            12: 31,
        };

        for (let i = 0; i < WEBS.length; i++) {
            const web = WEBS[i];

            await loginToWordpress(page, web);
            await page.waitForNavigation();

            for (let d = 1; d <= 3; d++) {
                for (let m = (d > 1 ? 10 : 11); m <= 12; m++) {
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
