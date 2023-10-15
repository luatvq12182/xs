const express = require("express");
const compression = require("compression");
const passport = require("passport");
const tokenRouter = require("./app/routes/token.route");
const kqxsRouter = require("./app/routes/kqxs.route");
const thongKeRouter = require("./app/routes/thongKe.route");
require("dotenv").config();
require("./config/database");
require("./config/passport");

const app = express();
// Middleware setup

app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public"));
app.use(compression());

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
app.get("/", (_req, res) => {
    res.sendFile("index.html");
});

// Other middleware and routes
app.post("/api/test", (req, res) => {
    res.json({
        msg: "Hello world",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
