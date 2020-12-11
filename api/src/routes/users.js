let UserModel = require("../models/item.model").users;
let express = require("express");
let router = express.Router();
var uniqid = require('uniqid');
var axios = require('axios');

router.get("/user", async (req, res) => {
    try {
        const { staffEmail, isOwner, email, shopName, shop_id } = req;
        res.json({ staffEmail, isOwner, email, shopName, shop_id });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/addUser", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    const shops = [{ shopName: req.body.shopName, shop_id: uniqid() }];
    const currentDate = new Date();

    let model = new UserModel({ email: req.email, joined: currentDate.toISOString(), shops, isOwner: true });
    model.save().then((doc) => {
        if (!doc || doc.length === 0) {
            return res.status(500).send(doc);
        }
        res.status(201).send({ message: "User added" });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post("/addStaffUser", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    UserModel.updateOne(
        { "shops.shop_id": req.shop_id },
        { $set: { "shops.$.staffEmail": req.body.email } }
    ).then((doc) => {
        if (!doc || doc.length === 0) {
            return res.status(500).send(doc);
        }
        res.status(201).send({ message: "User added" });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get("/resetPassword", (req, res) => {

    if (!req.email) {
        return res.status(400).send("Email required in reqest header");
    }

    const authData = {
        requestType: "PASSWORD_RESET",
        email: req.email,
    };
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + req.apiKey;

    axios.post(url, authData).then((response) => {
        res.status(201).send({ message: "Password Reset" });
    }).catch((err) => {
        res.status(500).json(err);
    });
});



router.put('/changeShopName', (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }
    if (!req.body.shopName) {
        return res.status(400).send("Request body is missing shopName");
    }

    UserModel.updateOne(
        { "shops.shop_id": req.shop_id },
        { $set: { "shops.$.shopName": req.body.shopName } }
    ).then(doc => {
        if (!doc || doc.length === 0) {
            return res.status(500).send({ shopName: req.body.shopName });
        }
        res.status(201).send(doc);
    }).catch(err => {
        res.status(500).json(err);
    })
});



module.exports = router;