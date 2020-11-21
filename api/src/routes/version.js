let VersionModel = require("../models/item.model").version;
let express = require("express");
let router = express.Router();

router.get("/version", (req, res) => {
    VersionModel.find({})
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;