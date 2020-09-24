const express = require("express");
const router = express.Router();
const db = require("./config/mongodb");
const {authenticateJWT} = require("./middleWare/jwtAuth");

router.get('/allStocks', authenticateJWT, function(req, res) {
    const allStocks = require("./data/symbols.json");

    if (allStocks) {
        return res.json({success: true, data: allStocks});
    }
    return res.json({success: false, error:"Data not found"});
});

router.get('/etfs/:symbol', authenticateJWT, function(req, res) {
    const symbol = req.params.symbol;
    const symbolEtfs = require(`./data/${symbol}.json`);

    if (symbolEtfs) {
        return res.json({success: true, data: symbolEtfs});
    }
    return res.json({success: false, error:"Data not found"});
});

module.exports = router;