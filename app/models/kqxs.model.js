const mongoose = require("mongoose");

const ketquaxosoSchema = new mongoose.Schema(
    {
        domain: Number,
        ketqua: Object,
        province: String,
        thongke: Object,
        ngay: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("KQXS", ketquaxosoSchema);
