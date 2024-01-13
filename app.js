const express = require("express");
const cors = require("cors");
// const passport = require("passport");
const tokenRouter = require("./app/routes/token.route");
const kqxsRouter = require("./app/routes/kqxs.route");
const thongKeRouter = require("./app/routes/thongke.route");
const soiCauRouter = require("./app/routes/soicau.route");
const aTrungRoiRouter = require("./app/routes/atrungroi.route");
const CACHE = require("./config/cache");
const { cvNum } = require("./app/utils");
require("dotenv").config();
require("./config/database");
require("./config/passport");
require("./config/schedule");

const app = express();
CACHE.invalid();
// Middleware setup

app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public"));
app.use(cors());

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
app.use("/api/soi-cau", soiCauRouter);
app.use("/api/atrungroi", aTrungRoiRouter);
app.get("/", (_req, res) => {
    res.sendFile("index.html");
});

app.get("/api/kqxs-cache", (req, res) => {
    const { domain, ngay, day, province } = req.query;

    const cache = CACHE.get("KQXS");

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

app.get("/api/kqxs-today-cache", (req, res) => {
    const cache = CACHE.get("KQXS-TODAY");

    res.json(cache);
});

app.post("/api/set-kqxs-today-cache", (req, res) => {
    console.log(req.body);

    CACHE.set('KQXS-TODAY', req.body);

    // const cache = CACHE.get("KQXS-TODAY");

    res.json('ok');
});

app.post("/api/invalid-cache", async (req, res) => {
    await CACHE.invalid();

    res.json("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
