let UserModel = require("../models/item.model").users;
let express = require("express");
let router = express.Router();
var uniqid = require('uniqid');
var axios = require('axios');

router.get("/user", async (req, res) => {
    try {
        const staffAccounts = await UserModel.find({ shop_id: { $in: req.shop_ids } }) || [];
        const staffEmails = staffAccounts.reduce((acc, item) => {
            return [...acc, item.email];
        }, [])

        res.json({ staffAccounts: staffEmails, isOwner: req.isOwner, email: req.email });
    } catch (err) {
        console.log('yoooo err', err);
        res.status(500).json(err);
    }
});

router.post("/addUser", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    let model = new UserModel({ email: req.email, shop_ids: [uniqid()], isOwner: true });
    model
        .save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }
            res.status(201).send({ message: "User added" });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/addStaffUser", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    let model = new UserModel({ email: req.body.email, shop_id: req.shop_ids[0], shop_ids: [req.shop_ids[0]], isOwner: false });
    model
        .save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }
            res.status(201).send({ message: "User added" });
        })
        .catch((err) => {
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

    axios
        .post(url, authData)
        .then((response) => {
            res.status(201).send({ message: "Password Reset" });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;