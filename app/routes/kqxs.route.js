const express = require("express");
const router = express.Router();
const kqxsController = require("../controllers/kqxs.controller");

router.get("/", kqxsController.getResult);
router.post("/", kqxsController.createResult);

module.exports = router;
