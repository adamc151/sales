let TillFloatModel = require("../models/item.model").tillFloat;
let express = require("express");
let router = express.Router();

router.get("/tillfloat", (req, res) => {
    TillFloatModel.find({ shop_id: req.shop_id })
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/tillfloat", async (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    try {
        const tillFloat = await TillFloatModel.findOne({ shop_id: req.shop_id });

        if (tillFloat) {
            tillFloat.value = req.body.value;
            tillFloat.dateTime = req.body.dateTime;
            await tillFloat.save();
        } else {
            let model = new TillFloatModel({ ...req.body, shop_id: req.shop_id });
            await model.save();
        }

        const doc = await TillFloatModel.find({ shop_id: req.shop_id });
        return res.status(201).send(doc);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;