const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const envVar = require("../env.json");

router.post('/login', function(req, res) {
    const { userKey } = req.body;
    if (userKey == envVar.userKey) {
        const accessToken = jwt.sign({ role: "Guest User" }, envVar.accessTokenSecret);
        return res.json({success: true, accessToken});
    }
    return res.json({success: false, error:"Wrong login key"});
});

module.exports = router;