const express = require("express");
const router = express.Router();
const kqxsController = require("../controllers/kqxs.controller");
const { require_query_params } = require("../utils");

router.get(
    "/",
    require_query_params(["domain", "ngay"]),
    kqxsController.gResult
);
router.post("/", kqxsController.createResult);
router.put("/", kqxsController.updateResult);

module.exports = router;
