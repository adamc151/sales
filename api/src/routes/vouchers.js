let VouchersModel = require("../models/item.model").vouchers;
let express = require("express");
let router = express.Router();

router.get("/vouchers", (req, res) => {
    VouchersModel.find({})
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;