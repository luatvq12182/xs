const fs = require("fs");
const { default: puppeteer } = require("puppeteer");
const { Constants } = require("../app/constants");

const DOMAIN = "https://vuaxoso.me";
const USERNAME = "admin";
const PASSWORD = "(emMXMfnwFYNdu7qiZ";

const URL_INSERT_PORT = DOMAIN + "/wp-admin/post-new.php?post_type=kqxs";

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

const insertPostDomainLevel = async (page, domain, date, month, YEAR) => {
    const a = {
        1: "XSMB",
        2: "XSMT",
        3: "XSMN",
    };

    const b = {
        1: "Bắc",
        2: "Trung",
        3: "Nam",
    };

    await page.goto(URL_INSERT_PORT);
    await page.type(
        "#title",
        `${a[domain]} ${date}/${month}/${YEAR} – KQ Xổ Số Miền ${b[domain]} Ngày ${date}-${month}-${YEAR}`
    );
    await page.select("#acf-domain", "" + domain);

    await page.evaluate(
        async (domain, date, month, a, b, YEAR) => {
            document.querySelector("#acf-date").value = `${YEAR}${month
                .toString()
                .padStart(2, "0")}${(date).toString().padStart(2, "0")}`;

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
            if (domain != 1) {
                document.querySelector(`#acf-province_${domain}`).value = "all";
            }

            document.querySelectorAll("#c_kqxschecklist label").forEach((e) => {
                if (e.innerText.trim().includes(a[domain])) {
                    e.click();
                }
            });

            document.querySelector("#publish").click();
        },
        domain,
        date,
        month,
        a,
        b,
        YEAR
    );

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 4000);
    });

    await page.evaluate(
        async (domain, date, month, a, b, YEAR) => {
            const convertToSnakeCase = (input) => {
                const normalized = input
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                const removedSpecialChars = normalized.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                );
                const lowercase = removedSpecialChars.toLowerCase();
                const snakeCase = lowercase.replace(/\s+/g, "-");
                document.querySelector("#publish").click();

                return snakeCase;
            };

            document.querySelector(".edit-slug").click();
            document.querySelector("#new-post-slug").value = convertToSnakeCase(
                `KQ Xổ Số Miền ${b[domain]} Ngày ${date} ${month} ${YEAR}`
            );
            document.querySelector("#edit-slug-buttons .save").click();
        },
        domain,
        date,
        month,
        a,
        b,
        YEAR
    );

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 4000);
    });

    console.log(
        "Done: ",
        domain == 1 ? "XSMB" : domain == 2 ? "XSMT" : "XSMN",
        ` - ${date}/${month}/${YEAR}`
    );
};

const insertPostProvinceLevel = async (page, domain, date, month, YEAR, errors) => {
    const provinceLabels = {
        binh_dinh: { name: "Bình Định", alias: "BDI" },
        da_nang: { name: "Đà Nẵng", alias: "DNG" },
        dak_lak: { name: "Đắk Lắk", alias: "DLK" },
        dak_nong: { name: "Đắk Nông", alias: "DNO" },
        gia_lai: { name: "Gia Lai", alias: "GL" },
        hue: { name: "Thừa Thiên Huế", alias: "TTH" },
        khanh_hoa: { name: "Khánh Hòa", alias: "KH" },
        kon_tum: { name: "Kon Tum", alias: "KT" },
        ninh_thuan: { name: "Ninh Thuận", alias: "NT" },
        phu_yen: { name: "Phú Yên", alias: "PY" },
        quang_binh: { name: "Quảng Bình", alias: "QB" },
        quang_nam: { name: "Quảng Nam", alias: "QNA" },
        quang_ngai: { name: "Quảng Ngãi", alias: "QNG" },
        quang_tri: { name: "Quảng Trị", alias: "QT" },
        an_giang: { name: "An Giang", alias: "AG" },
        bac_lieu: { name: "Bạc Liêu", alias: "BL" },
        ben_tre: { name: "Bến Tre", alias: "BT" },
        binh_duong: { name: "Bình Dương", alias: "BD" },
        binh_phuoc: { name: "Bình Phước", alias: "BP" },
        binh_thuan: { name: "Bình Thuận", alias: "BTH" },
        ca_mau: { name: "Cà Mau", alias: "CM" },
        can_tho: { name: "Cần Thơ", alias: "CT" },
        da_lat: { name: "Đà Lạt", alias: "DL" },
        dong_nai: { name: "Đồng Nai", alias: "DN" },
        dong_thap: { name: "Đồng Tháp", alias: "DT" },
        hau_giang: { name: "Hậu Giang", alias: "HG" },
        ho_chi_minh: { name: "Hồ Chí Minh", alias: "HCM" },
        kien_giang: { name: "Kiên Giang", alias: "KG" },
        long_an: { name: "Long An", alias: "LA" },
        soc_trang: { name: "Sóc Trăng", alias: "ST" },
        tay_ninh: { name: "Tây Ninh", alias: "TN" },
        tien_giang: { name: "Tiền Giang", alias: "TG" },
        tra_vinh: { name: "Trà Vinh", alias: "TV" },
        vinh_long: { name: "Vĩnh Long", alias: "VL" },
        vung_tau: { name: "Vũng Tàu", alias: "VT" },
    };

    const LICH_QUAY_THUONG = {
        0: {
            2: ["hue", "khanh_hoa", "kon_tum"],
            3: ["da_lat", "kien_giang", "tien_giang"],
        },
        1: {
            2: ["hue", "phu_yen"],
            3: ["ca_mau", "dong_thap", "ho_chi_minh"],
        },
        2: {
            2: ["dak_lak", "quang_nam"],
            3: ["bac_lieu", "ben_tre", "vung_tau"],
        },
        3: {
            2: ["da_nang", "khanh_hoa"],
            3: ["can_tho", "dong_nai", "soc_trang"],
        },
        4: {
            2: ["binh_dinh", "quang_binh", "quang_tri"],
            3: ["an_giang", "binh_thuan", "tay_ninh"],
        },
        5: {
            2: ["gia_lai", "ninh_thuan"],
            3: ["binh_duong", "tra_vinh", "vinh_long"],
        },
        6: {
            2: ["da_nang", "dak_nong", "quang_ngai"],
            3: ["binh_phuoc", "hau_giang", "long_an", "ho_chi_minh"],
        },
    };

    const day = new Date(`${month}-${date}-${YEAR}`).getDay();

    const provinces = Object.values(LICH_QUAY_THUONG[day][domain]);

    for (let i = 0; i < provinces.length; i++) {
        try {
            const currentProvince = provinces[i];

            await page.goto(URL_INSERT_PORT);
            await page.type(
                "#title",
                `XS${provinceLabels[currentProvince].alias} ${date}/${month}/${YEAR} – KQ Xổ Số ${provinceLabels[currentProvince].name} Ngày ${date}-${month}-${YEAR}`
            );
            await page.select("#acf-domain", "" + domain);
    
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 300);
            });
    
            await page.evaluate(
                async (
                    domain,
                    date,
                    month,
                    provinceLabels,
                    currentProvince,
                    YEAR
                ) => {
                    const a = {
                        1: "XSMB",
                        2: "XSMT",
                        3: "XSMN",
                    };
    
                    const b = {
                        1: "Bắc",
                        2: "Trung",
                        3: "Nam",
                    };
    
                    document.querySelector("#acf-date").value = `${YEAR}${month
                        .toString()
                        .padStart(2, "0")}${(date)
                        .toString()
                        .padStart(2, "0")}`;
    
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 500);
                    });
                    document.querySelector(`#acf-province_${domain}`).value =
                        currentProvince;
    
                    document
                        .querySelectorAll("#c_kqxschecklist label")
                        .forEach((e) => {
                            if (e.innerText.trim().includes(a[domain])) {
                                e.click();
                            }
                        });
    
                    document.querySelector("#publish").click();
                },
                domain,
                date,
                month,
                provinceLabels,
                currentProvince,
                YEAR
            );
    
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 4000);
            });
    
            await page.evaluate(
                async (
                    domain,
                    date,
                    month,
                    provinceLabels,
                    currentProvince,
                    YEAR
                ) => {
                    const convertToSnakeCase = (input) => {
                        const normalized = input
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
                        const removedSpecialChars = normalized.replace(
                            /[^a-zA-Z0-9 ]/g,
                            ""
                        );
                        const lowercase = removedSpecialChars.toLowerCase();
                        const snakeCase = lowercase.replace(/\s+/g, "-");
    
                        return snakeCase;
                    };
    
                    document.querySelector(".edit-slug").click();
                    document.querySelector("#new-post-slug").value =
                        convertToSnakeCase(
                            `KQ Xổ Số ${provinceLabels[currentProvince].name} Ngày ${date} ${month} ${YEAR}`
                        );
                    document.querySelector("#edit-slug-buttons .save").click();
    
                    document.querySelector("#publish").click();
                },
                domain,
                date,
                month,
                provinceLabels,
                currentProvince,
                YEAR
            );
    
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 4000);
            });
    
            console.log(
                "Done: ",
                provinceLabels[currentProvince].name,
                ` - ${date}/${month}/${YEAR}`
            );            
        } catch (error) {
            errors.push({
                domain,
                date,
                month,
                province: provinces[i]
            });            
        }
    }
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

        await loginToWordpress(page, { DOMAIN, USERNAME, PASSWORD });
        await page.waitForNavigation();

        // const MONTHS = {
        //     1: 31,
        //     2: 29,
        //     3: 31,
        //     4: 30,
        //     5: 31,
        //     6: 30,
        //     7: 31,
        //     8: 31,
        //     9: 30,
        //     10: 20,
        //     11: 30,
        //     12: 31,
        // };

        // const errors = [];

        // for (let month = 12; month <= 12; month++) {
        //     for (let date = 15; date <= MONTHS[month]; date++) {
        //         for (let domain = 1; domain <= 3; domain++) {
        //             try {
        //                 await insertPostDomainLevel(page, domain, date, month);
        //                 if (domain !== 1) {
        //                     await insertPostProvinceLevel(
        //                         page,
        //                         domain,
        //                         date,
        //                         month
        //                     );
        //                 }
        //             } catch (error) {
        //                 console.log("Error in loop: ", error?.message);

        //                 errors.push({
        //                     domain,
        //                     date,
        //                     month,
        //                 });
        //             }
        //         }
        //     }
        // }

        // if (errors.length > 0) {
        //     const contentToWrite = errors
        //         .map(({ domain, date, month }) => {
        //             return `Domain: ${domain} - Date: ${date} - Month: ${month}`;
        //         })
        //         .join("\n");

        //     const filePath = "error.txt";

        //     fs.writeFile(filePath, contentToWrite, (err) => {
        //         if (err) {
        //             console.error("Error writing to file:", err);
        //         } else {
        //             console.log(
        //                 `File '${filePath}' has been written successfully.`
        //             );

        //             process.exit();
        //         }
        //     });
        // } else {
        //     process.exit();
        // }

        const DATE = 6;
        const MONTH = 1;
        const YEAR = 2024;

        await insertPostDomainLevel(page, Constants.Domain.MienBac, DATE, MONTH, YEAR);
        await insertPostDomainLevel(page, Constants.Domain.MienTrung, DATE, MONTH, YEAR);
        await insertPostDomainLevel(page, Constants.Domain.MienNam, DATE, MONTH, YEAR);
        await insertPostProvinceLevel(page, Constants.Domain.MienTrung, DATE, MONTH, YEAR);
        await insertPostProvinceLevel(page, Constants.Domain.MienNam, DATE, MONTH, YEAR);

        process.exit();
    } catch (error) {
        console.log("Error main: ", error);
    }
};

const upBaiVuaXoSo = async (date, month, year) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: true,
        timeout: 30000,
    });

    const page = await browser.newPage();

    await loginToWordpress(page, { DOMAIN, USERNAME, PASSWORD });
    await page.waitForNavigation();

    const errors = [];

    for (let m = month; m <= month; m++) {
        for (let d = date; d <= date; d++) {
            for (let domain = 1; domain <= 3; domain++) {
                try {
                    await insertPostDomainLevel(page, domain, date, month);
                    if (domain !== 1) {
                        await insertPostProvinceLevel(
                            page,
                            domain,
                            date,
                            month,
                            errors
                        );
                    }
                } catch (error) {
                    console.log("Error in loop: ", error?.message);

                    errors.push({
                        domain,
                        date,
                        month,
                    });
                }
            }
        }
    }

    if (errors.length > 0) {
        const contentToWrite = errors
            .map(({ domain, date, month, province }) => {
                return `Domain: ${domain} - Date: ${date} - Month: ${month} ${province ? ` - Province: ${province}` : ''}`;
            })
            .join("\n");

        const filePath = "up-bai-kqxs-vuaxoso.error.txt";

        fs.writeFile(filePath, contentToWrite, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
            } else {
                console.log(
                    `File '${filePath}' has been written successfully.`
                );

                process.exit();
            }
        });
    } else {
        process.exit();
    }    
}

// main();

module.exports = {
    upBaiVuaXoSo
}