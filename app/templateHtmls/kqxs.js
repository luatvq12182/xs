const { Constants } = require("../constants");

const cvToHtml = (domain, ngay, kqxs) => {
    if (domain == Constants.Domain.MienBac) {
        const ketqua = kqxs.ketqua;
        const thongke = kqxs.thongke;
        const dau = thongke.dau;
        const duoi = thongke.duoi;

        const genClass = {
            1: "number-col-1",
            2: "number-col-1",
            3: "number-col-2",
            4: "number-col-3",
            5: "number-col-4",
            6: "number-col-3",
            7: "number-col-3",
            8: "number-col-4",
        };

        let html = `
            <div>
                <table class="kq-table xsmb table-striped js-kq-table">
                    <tbody>
                        ${Object.keys(ketqua)
                            .map((e, index) => {
                                const giai =
                                    index === 1 ? "G.ĐB" : `G.${index - 1}`;

                                if (Array.isArray(ketqua[e])) {
                                    return `
                                <tr>
                                <td>${giai}</td>
                                <td>
                                    <div class="${genClass[index]}">
                                    ${ketqua[e]
                                        .map((el) => {
                                            return `
                                        <span
                                        class="number ${
                                            [1, 8].includes(index)
                                                ? "big red"
                                                : ""
                                        } ${el}"
                                        data-id-giai="${index - 1}"
                                        data-num="${el}"
                                        >${el}</span
                                        >                      
                                    `;
                                        })
                                        .join("")}
                                    </div>
                                </td>
                                </tr>
                            `;
                                } else {
                                    return `
                                <tr>
                                <td>Mã ĐB</td>
                                <td>
                                    <span class="winner-code" id="mad_db">
                                    ${ketqua[e]}
                                    </span>
                                </td>
                                </tr>              
                            `;
                                }
                            })
                            .join("")}
                    </tbody>
                </table>
            </div>

            <div class="control_panel clearfix">
                <div class="config_view clearfix js-config-view">
                    <form>
                        <label class="radio-inline">
                            <input type="radio" name="show_number" value="-1" checked="" /> Đầy đủ</label>
                        <label class="radio-inline"><input type="radio" name="show_number" value="2" /> 2 số</label>
                        <label class="radio-inline">
                            <input type="radio" name="show_number" value="3" /> 3 số
                        </label>
                    </form>
                </div>
      
                <div class="config_highlight">
                    <span class="hl_number js-hl-number" data-highlight-number="0">0</span>
                    <span class="hl_number js-hl-number" data-highlight-number="1">1</span>
                    <span class="hl_number js-hl-number" data-highlight-number="2">2</span>
                    <span class="hl_number js-hl-number" data-highlight-number="3">3</span>
                    <span class="hl_number js-hl-number" data-highlight-number="4">4</span>
                    <span class="hl_number js-hl-number" data-highlight-number="5">5</span>
                    <span class="hl_number js-hl-number" data-highlight-number="6">6</span>
                    <span class="hl_number js-hl-number" data-highlight-number="7">7</span>
                    <span class="hl_number js-hl-number" data-highlight-number="8">8</span>
                    <span class="hl_number js-hl-number" data-highlight-number="9">9</span>
                </div>
            </div>
      
            <div class="kq-block box-thong-ke-nhanh mienbac">
                <h4 class="kq-block-title font-weight-normal text-center">
                    THỐNG KÊ LÔ TÔ KẾT QUẢ XSMB NGÀY ${ngay}
                </h4>

                <table>
                    <thead>
                        <tr>
                            <th>Đầu</th>
                            <th>Đuôi</th>
                            <th>Đầu</th>
                            <th>Đuôi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(dau)
                            .map((e, index) => {
                                return `
                            <tr>
                                <td>${index}</td>
                                <td>${e.join(", ")}</td>
                                <td>${duoi[index].join(", ")}</td>
                                <td>${index}</td>
                            </tr>
                            `;
                            })
                            .join("")}
                    </tbody>
                </table>                 
            </div>                 
        `;

        return html;
    } else {
        if (Array.isArray(kqxs)) {
            const provinces = kqxs.map((e) => e.province);
            const ketquas = kqxs.map((e) => e.ketqua);
            const thongkes = kqxs.map((e) => e.thongke);
            const prizes = [
                "ĐB",
                "G.1",
                "G.2",
                "G.3",
                "G.4",
                "G.5",
                "G.6",
                "G.7",
                "G.8",
            ];

            const html = `
            <div>
                <table class="kq-table table-striped js-kq-table">
                    <tr class="kq-city-name">
                        <th>Tỉnh</th>
                        ${provinces
                            .map((e) => {
                                return `<th title="Kết quả xổ số ${e}">${e}</th>`;
                            })
                            .join("")}
                    </tr>
                    ${prizes
                        .map((e, index) => {
                            return `
                        <tr>
                        <td>${e}</td>
                        ${ketquas
                            .map((kq) => {
                                const giai = `giai${index ? index : "dacbiet"}`;

                                return `
                            <td>
                                ${kq[giai]
                                    .map((num) => {
                                        return `<span class="number ${
                                            ["giai8", "giaidacbiet"].includes(
                                                giai
                                            )
                                                ? "big red"
                                                : ""
                                        }" data-id-giai="${giai}" data-num="${num}">${num}</span>`;
                                    })
                                    .join("")}
                            </td>
                            `;
                            })
                            .join("")}
                        </tr>      
                    `;
                        })
                        .reverse()
                        .join("")}
                </table>

                <div class="control_panel clearfix">
                    <div class="config_view clearfix js-config-view">
                        <form>
                            <label class="radio-inline">
                                <input type="radio" name="show_number" value="-1" checked="" /> Đầy đủ</label>
                            <label class="radio-inline"><input type="radio" name="show_number" value="2" /> 2 số</label>
                            <label class="radio-inline">
                                <input type="radio" name="show_number" value="3" /> 3 số
                            </label>
                        </form>
                    </div>
            
                    <div class="config_highlight">
                        <span class="hl_number js-hl-number" data-highlight-number="0">0</span>
                        <span class="hl_number js-hl-number" data-highlight-number="1">1</span>
                        <span class="hl_number js-hl-number" data-highlight-number="2">2</span>
                        <span class="hl_number js-hl-number" data-highlight-number="3">3</span>
                        <span class="hl_number js-hl-number" data-highlight-number="4">4</span>
                        <span class="hl_number js-hl-number" data-highlight-number="5">5</span>
                        <span class="hl_number js-hl-number" data-highlight-number="6">6</span>
                        <span class="hl_number js-hl-number" data-highlight-number="7">7</span>
                        <span class="hl_number js-hl-number" data-highlight-number="8">8</span>
                        <span class="hl_number js-hl-number" data-highlight-number="9">9</span>
                    </div>
                </div> 

                <div class="kq-block box-thong-ke-nhanh">
                    <h4 class="kq-block-title font-weight-normal text-center">
                        THỐNG KÊ LÔ TÔ KẾT QUẢ ${
                            +domain === Constants.Domain.MienTrung
                                ? "XSMT"
                                : "XSMN"
                        } NGÀY ${ngay}
                    </h4>

                    <table>
                        <thead>
                            <tr>
                                <th>Đầu</th>
                                ${provinces
                                    .map((e) => {
                                        return `<th>${e}</th>`;
                                    })
                                    .join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                                .map((e) => {
                                    return `
                                        <tr>
                                            <td>${e}</td>
                                            ${thongkes
                                                .map((tk) => {
                                                    return `
                                                    <td>${Object.values(
                                                        tk.dau[e]
                                                    ).join(", ")}</td>
                                                `;
                                                })
                                                .join("")}
                                        </tr>
                                    `;
                                })
                                .join("")}
                        </tbody>
                    </table>                 
                </div>                                         
            </div>                 
        `;

            return html;
        } else {
            const province = kqxs.province;
            const prizes = [
                "ĐB",
                "G.1",
                "G.2",
                "G.3",
                "G.4",
                "G.5",
                "G.6",
                "G.7",
                "G.8",
            ];
            const genClass = {
                0: "number-col-1",
                1: "number-col-1",
                2: "number-col-1",
                3: "number-col-2",
                4: "number-col-4",
                5: "number-col-1",
                6: "number-col-3",
                7: "number-col-1",
                8: "number-col-1",
            };
            const ketqua = kqxs.ketqua;
            const dau = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
            };
            const duoi = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
            };

            Object.values(ketqua)
                .flat()
                .forEach((num) => {
                    const cvNum = num.slice(-2);
                    dau[cvNum[0]].push(cvNum[1]);
                    duoi[cvNum[1]].push(cvNum[0]);
                });

            let html = `
            <div>
                <table class="kq-table xsmb table-striped js-kq-table">
                    <tbody>
                    ${prizes
                        .map((e, index) => {
                            const giai = `giai${index ? index : "dacbiet"}`;

                            return `
                                <tr>
                                <td>${e}</td>
                                <td>
                                    <div class="${genClass[index]}">
                                        ${Object.values(ketqua)
                                            [index].map((num) => {
                                                return `
                                                    <span class="number ${
                                                        [
                                                            "giai8",
                                                            "giaidacbiet",
                                                        ].includes(giai)
                                                            ? "big red"
                                                            : ""
                                                    }" data-id-giai="${giai}" data-num="${num}">${num}</span>
                                                `;
                                            })
                                            .join(
                                                ""
                                            )}                                
                                    </div>
                                </td>
                            `;
                        })
                        // .reverse()
                        .join("")}
                    </tbody>
                </table>
            </div>

            <div class="control_panel clearfix">
                <div class="config_view clearfix js-config-view">
                    <form>
                        <label class="radio-inline">
                            <input type="radio" name="show_number" value="-1" checked="" /> Đầy đủ</label>
                        <label class="radio-inline"><input type="radio" name="show_number" value="2" /> 2 số</label>
                        <label class="radio-inline">
                            <input type="radio" name="show_number" value="3" /> 3 số
                        </label>
                    </form>
                </div>
      
                <div class="config_highlight">
                    <span class="hl_number js-hl-number" data-highlight-number="0">0</span>
                    <span class="hl_number js-hl-number" data-highlight-number="1">1</span>
                    <span class="hl_number js-hl-number" data-highlight-number="2">2</span>
                    <span class="hl_number js-hl-number" data-highlight-number="3">3</span>
                    <span class="hl_number js-hl-number" data-highlight-number="4">4</span>
                    <span class="hl_number js-hl-number" data-highlight-number="5">5</span>
                    <span class="hl_number js-hl-number" data-highlight-number="6">6</span>
                    <span class="hl_number js-hl-number" data-highlight-number="7">7</span>
                    <span class="hl_number js-hl-number" data-highlight-number="8">8</span>
                    <span class="hl_number js-hl-number" data-highlight-number="9">9</span>
                </div>
            </div>
      
            <div class="kq-block box-thong-ke-nhanh mienbac">
                <h4 class="kq-block-title font-weight-normal text-center">
                    THỐNG KÊ LÔ TÔ ${province} NGÀY ${ngay}
                </h4>

                <table>
                    <thead>
                        <tr>
                            <th>Đầu</th>
                            <th>Đuôi</th>
                            <th>Đầu</th>
                            <th>Đuôi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(dau)
                            .map((e, index) => {
                                return `
                            <tr>
                                <td>${index}</td>
                                <td>${e.join(", ")}</td>
                                <td>${duoi[index].join(", ")}</td>
                                <td>${index}</td>
                            </tr>
                            `;
                            })
                            .join("")}
                    </tbody>
                </table>                 
            </div>                 
        `;

            return html;
        }
    }
};

module.exports = {
    cvToHtml,
};
