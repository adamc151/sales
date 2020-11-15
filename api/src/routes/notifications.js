let NotificationsModel = require("../models/item.model").notifications;
let express = require("express");
let router = express.Router();

router.get("/notifications", (req, res) => {
    if (req.isOwner) {
        NotificationsModel.find({ shop_id: req.shop_id })
            .then((doc) => {
                res.json(doc);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    } else {
        res.status(500).json({ error: "Not Authorized Account" });
    }
});

router.post("/addNotification", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    let model = new NotificationsModel({ ...req.body, shop_id: req.shop_id });
    model
        .save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }
            res.status(201).send(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.delete("/clearNotifications", (req, res) => {
    if (req.isOwner) {
        NotificationsModel.deleteMany({ shop_id: req.shop_id })
            .then((doc) => {
                res.json(doc);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    } else {
        res.status(500).json({ error: "Not Authorized Account" });
    }
});

module.exports = router;