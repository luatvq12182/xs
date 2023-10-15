const { Constants } = require("../constants");
const { lay10SoLonNhat } = require("../utils");

const thongKe10SoXuatHienNhieuNhat = (kqxs, cvHtml = false) => {
    const numbers = {};

    kqxs.forEach((e) => {
        const rs = Object.values(e.ketqua)
            .filter(Array.isArray)
            .flat()
            .map((e) => {
                return e.slice(-2);
            });

        rs.forEach((e) => {
            if (numbers[e]) {
                numbers[e] = numbers[e] + 1;
            } else {
                numbers[e] = 1;
            }
        });
    });

    const resData = lay10SoLonNhat(numbers);

    if (cvHtml) {
        const html = `
            <table class="table table-bordered">
                <tbody>
                    ${resData
                        .map((e) => {
                            return `
                            <tr>
                                <td style="padding: 3px; text-align: center;">
                                    <span class="tk_number font-weight-bold display-block red js-tk-number" data-kyquay="30" data-mientinh="mb">${e[0]}</span>                                    
                                </td>
                                <td style="padding: 3px; text-align: center;">
                                    ${e[1]} lần
                                </td>
                            </tr>
                        `;
                        })
                        .join("")}
                </tbody>             
            </table>
        `;

        return html;
    }

    return resData;
};

const thongKe10SoLauXuatHienNhat = (kqxs, cvHtml = false) => {
    const numbers = {};

    Array(100)
        .fill(1)
        .forEach((_e, index) => {
            numbers[index < 10 ? `0${index}` : index] = [0, ""];
        });

    for (let i = 0; i < kqxs.length; i++) {
        const kq = Object.values(kqxs[i].ketqua).flat().slice(1);
        let date = new Date(kqxs[i].ngay);
        date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        kq.forEach((num) => {
            if (numbers[num.slice(-2)][0] === 0) {
                numbers[num.slice(-2)] = [
                    i,
                    date,
                    Constants.GanCucDai[num.slice(-2)],
                ];
            }
        });
    }

    const resData = Object.entries(numbers)
        .sort((a, b) => a[1][0] - b[1][0])
        .slice(-10)
        .reverse();

    if (cvHtml) {
        const html = `
                <table class="table">
                    <thead>
                        <td style="text-align: center;">Con số</td>
                        <td style="text-align: center;">Số ngày chưa ra</td>
                        <td style="text-align: center;">Ngày ra gần nhất</td>
                        <td style="text-align: center;">Gan cực đại</td>
                    </thead>

                    <tbody>
                        ${resData
                            .map((row) => {
                                return `
                                <tr>
                                    <td style="text-align: center; padding: 3px;">
                                        <span class="tk_number font-weight-bold red" data-kyquay="30" data-mientinh="mb">${
                                            row[0]
                                        }</span>
                                    </td>
                                    <td style="text-align: center; padding: 3px;">
                                        ${row[1][0]}
                                    </td>
                                    <td style="text-align: center; padding: 3px;">
                                        ${row[1][1]}
                                    </td>
                                    <td style="text-align: center; padding: 3px;">
                                        ${row[1][2] || "..."}
                                    </td>
                                </tr>
                            `;
                            })
                            .join("")}
                    </tbody>
                </table>
            `;

        return html;
    }

    return resData;
};

const thongKe10SoRaLienTiep = (kqxs, cvHtml = false) => {
    const numbers = {};

    const arr = kqxs.map((e) => {
        return Object.values(e.ketqua)
            .filter(Array.isArray)
            .flat()
            .map((e) => {
                return e.slice(-2);
            });
    });

    for (let i = 0; i <= 99; i++) {
        const num = i < 10 ? "0" + i : "" + i;

        let count = 0;
        let continuously = 0;
        let biggestContinuously = 0;

        arr.forEach((e, index) => {
            e.forEach((numb) => {
                if (numb === num) {
                    count++;
                }
            });

            if (e.includes(num) && (arr[index - 1] || []).includes(num)) {
                continuously = continuously + 1;
            } else {
                continuously = 1;
            }

            if (continuously > biggestContinuously) {
                biggestContinuously = continuously;
            }
        });

        numbers[num] = [biggestContinuously, count];
    }

    const resData = Object.entries(numbers)
        .sort((a, b) => b[1][0] - a[1][0])
        .slice(0, 10);

    if (cvHtml) {
        const bigArray = [...resData];

        const arrayOfArrays = bigArray.reduce((acc, el, index) => {
            const subArrayIndex = Math.floor(index / 5);
            if (!acc[subArrayIndex]) {
                acc[subArrayIndex] = [];
            }
            acc[subArrayIndex].push(el);
            return acc;
        }, []);

        const html = `
            <table class="table table-bordered">
                <tbody>
                    ${arrayOfArrays
                        .map((subArr) => {
                            return `
                            <tr>
                                ${subArr
                                    .map((e) => {
                                        return `
                                        <td style="text-align: center;">
                                            <span class="tk_number font-weight-bold display-block red js-tk-number" style="display: block; line-height: 20px;" data-kyquay="30" data-mientinh="mb">${e[0]}</span>
                                            <small style="line-height: 20px;">${e[1][0]} ngày<br style="display: block;">(${e[1][1]} lần)</small>
                                        </td>                                    
                                    `;
                                    })
                                    .join("")}
                            </tr>
                        `;
                        })
                        .join("")}
                </tbody>
            </table>
        `;

        return html;
    }

    res.json(resData);
};

module.exports = {
    thongKe10SoXuatHienNhieuNhat,
    thongKe10SoLauXuatHienNhat,
    thongKe10SoRaLienTiep,
};
