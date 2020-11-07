let UserModel = require("../models/item.model").users;
let express = require("express");
let router = express.Router();
var uniqid = require('uniqid');

router.get("/user", (req, res) => {
    UserModel.find({ email: req.email })
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
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

module.exports = router;