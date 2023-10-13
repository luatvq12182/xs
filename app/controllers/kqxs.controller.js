const { Constants } = require("../constants");
const KQXSModel = require("../models/kqxs.model");

const getResult = async (req, res) => {
    try {
        const { ngay, domain, province, cvHtml } = req.query;

        if (!ngay && !domain && !province) {
            const rs = await KQXSModel.find({}).sort({
                ngay: -1,
            });

            res.json(rs);

            return;
        }

        if (!ngay) {
            res.status(500).json({
                error: "Vui lòng cung cấp ngày cần xem kết quả",
            });
            return;
        }

        if (!domain) {
            res.status(500).json({
                error: "Vui lòng cung cấp miền cần xem kết quả",
            });
            return;
        }

        const [d, m, y] = ngay.split("-");

        const dateToFind = new Date(`${m}-${d}-${y}`);
        const startOfDay = new Date(dateToFind);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateToFind);
        endOfDay.setHours(23, 59, 59, 999);

        console.log(startOfDay, " | ", endOfDay);

        const query = {
            ngay: { $gte: startOfDay, $lte: endOfDay },
            domain,
        };

        if (province) {
            query.province = province;
        }

        const kqxs = await KQXSModel.find(query);

        if (cvHtml) {
            const ketqua = kqxs[0].ketqua;

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
                                <div>
                                  ${ketqua[e]
                                      .map((el) => {
                                          return `
                                    <span
                                      class="number big red ${el}"
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
            `;

            res.json(html);

            return;
        }

        if (kqxs) {
            res.json(kqxs);
        } else {
            res.status(404).json({
                msg: "Không tìm thấy kết quả",
            });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Error fetching" });
    }
};

const createResult = async (req, res) => {
    const kq = new KQXSModel(req.body);

    try {
        await kq.save();
        res.status(201).json(kq);
    } catch (error) {
        res.status(500).json({ error: "Error creating" });
    }
};

module.exports = {
    getResult,
    createResult,
};
