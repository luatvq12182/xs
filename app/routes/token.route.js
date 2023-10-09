const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.controller");

router.post("/token/generate", tokenController.genToken);

module.exports = router;
