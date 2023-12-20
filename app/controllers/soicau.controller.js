const CACHE = require("../../config/cache");
const { Constants } = require("../constants");

const loto = (req, res) => {
    try {
        const { province, numberOfDays } = req.query;

        let kqxs = CACHE.get("KQXS");

        if (province == 1) {
            kqxs = kqxs[1];
        } else {
            kqxs =
                kqxs[2][province] ||
                kqxs[3][province === "Hồ Chí Minh" ? "TPHCM" : province];
        }

        kqxs = Object.values(kqxs).slice(-(+numberOfDays + 1));
        kqxs.reverse();

        const response = {
            nums: {},
            kqxs,
        };

        const indexes = {
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

        Object.entries(kqxs[0].ketqua).forEach((e, index) => {
            if (province == Constants.Domain.MienBac && index == 0) return;

            e[1].forEach((num, indexN) => {
                num.split("").forEach((c, indexC) => {
                    indexes[c].push([e[0], indexN, indexC]);
                });
            });
        });

        const prizes = {
            giaidacbiet: 0,
            giai1: 1,
            giai2: 2,
            giai3: 3,
            giai4: 4,
            giai5: 5,
            giai6: 6,
            giai7: 7,
            giai8: 8,
        };

        Array.from({ length: 100 }, (_, index) => {
            return index.toString().padStart(2, "0");
        }).forEach((numSelect) => {
            const indexsNeedToCheck = [];
            const num1 = numSelect[0];
            const num2 = numSelect[1];

            if (num1 === num2) {
                for (let i = 0; i < indexes[num1].length - 1; i++) {
                    for (let j = i + 1; j < indexes[num1].length; j++) {
                        indexsNeedToCheck.push({
                            i1: indexes[num1][i],
                            i2: indexes[num1][j],
                        });
                    }
                }
            } else {
                for (let i = 0; i < indexes[num1].length; i++) {
                    for (let j = 0; j < indexes[num2].length; j++) {
                        const index1 = indexes[num1][i];
                        const index2 = indexes[num2][j];

                        if (
                            `${prizes[index1[0]]}${prizes[index1[1]]}${
                                prizes[index1[2]]
                            }` <=
                            `${prizes[index2[0]]}${prizes[index1[1]]}${
                                prizes[index1[2]]
                            }`
                        ) {
                            indexsNeedToCheck.push({
                                i1: index1,
                                i2: index2,
                            });
                        }
                    }
                }
            }

            let validIndexes = null;

            const rs = [];

            for (let i = 0; i < kqxs.length; i++) {
                const kq = kqxs[i];
                let nums = Object.entries(kq.ketqua);

                if (province == 1) {
                    nums = nums.slice(1);
                }

                rs.push({
                    nums: Object.values(kq.ketqua)
                        .flat()
                        .map((e) => {
                            if (e) {
                                return e.slice(-2);
                            }
                        }),
                    hashMap: nums.reduce((pre, cr) => {
                        return {
                            ...pre,
                            [cr[0]]: cr[1],
                        };
                    }, {}),
                });
            }

            for (let i = 0; i < indexsNeedToCheck.length; i++) {
                const i1 = indexsNeedToCheck[i].i1;
                const i2 = indexsNeedToCheck[i].i2;

                let isValid = true;

                for (let j = 1; j < rs.length; j++) {
                    let numOfIndex = `${rs[j].hashMap[i1[0]][i1[1]][i1[2]]}${
                        rs[j].hashMap[i2[0]][i2[1]][i2[2]]
                    }`;

                    if (
                        !rs[j - 1].nums.includes(numOfIndex) &&
                        !rs[j - 1].nums.includes(
                            `${numOfIndex[1]}${numOfIndex[0]}`
                        )
                    ) {
                        isValid = false;
                    }
                }

                if (isValid) {
                    validIndexes = indexsNeedToCheck[i];

                    break;
                }
            }

            if (validIndexes) {
                response.nums[numSelect] = Object.values(validIndexes);
            }
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error");
    }
};

module.exports = {
    loto,
};
