let TeamMembersModel = require("../models/item.model").teamMembers;
let express = require("express");
let router = express.Router();

router.get("/getTeam", (req, res) => {
    TeamMembersModel.find({ shop_id: req.shop_id })
        .then((teamMembers) => {
            const myTeam = [];
            teamMembers.map((member) => {
                myTeam.push({
                    name: member.name, id: member.id, shop_id: member.shop_id,
                });
            });
            res.json(myTeam);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/addTeamMember", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    let model = new TeamMembersModel({ name: req.body.name, shop_id: req.shop_id });

    model.save().then((doc) => {
        if (!doc || doc.length === 0) {
            return res.status(500).send(doc);
        }
        res.status(201).send({ message: "Team member added" });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.delete("/deleteTeamMember", (req, res) => {
    if (!req.query.id) {
        return res.status(400).send("missing URL param: id");
    }
    TeamMembersModel.findOneAndRemove({
        _id: req.query.id,
    })
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;