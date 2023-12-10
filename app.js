const express = require("express");
// const passport = require("passport");
const tokenRouter = require("./app/routes/token.route");
const kqxsRouter = require("./app/routes/kqxs.route");
const thongKeRouter = require("./app/routes/thongKe.route");
const aTrungRoiRouter = require("./app/routes/atrungroi.route");
const KQXS_CACHE = require("./config/cache");
const { cvNum } = require("./app/utils");
require("dotenv").config();
require("./config/database");
require("./config/passport");

const app = express();
KQXS_CACHE.invalid();
// Middleware setup

app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public"));

// app.use(
//     "/api",
//     passport.authenticate("jwt", { session: false }),
//     (_req, res) => {
//         // This route is protected and can only be accessed with a valid JWT
//         res.json({ message: "What are u doing ?" });
//     }
// );

// Mount the API router
app.use("/", tokenRouter);
app.use("/api/kqxs", kqxsRouter);
app.use("/api/thong-ke", thongKeRouter);
app.use("/api/atrungroi", aTrungRoiRouter);
app.get("/", (_req, res) => {
    res.sendFile("index.html");
});

// Other middleware and routes
app.post("/api/test", (req, res) => {
    res.json({
        msg: "Hello world",
    });
});

app.get("/api/kqxs-cache", (req, res) => {
    const { domain, ngay, day, province } = req.query;

    const cache = KQXS_CACHE.get();

    let response = cache;

    if (domain) {
        response = cache[domain];
    }

    if (ngay) {
        const [d, m, y] = ngay.split("-");

        response = response[`${y}${cvNum(m)}${cvNum(d)}`];
    }

    if (day) {
        response = response[day];
    }

    if (province) {
        response = response[province];
    }

    res.json(response);
});

app.post("/api/invalid-cache", async (req, res) => {
    await KQXS_CACHE.invalid();

    res.json("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
