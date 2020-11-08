let TeamMembersModel = require("../models/item.model").teamMembers;
let express = require("express");
let router = express.Router();

router.get("/team", (req, res) => {
    TeamMembersModel.find({ shop_id: { $in: req.shop_ids } })
        .then((teamMembers) => {
            const myTeam = [];
            teamMembers.map((member) => {
                myTeam.push({
                    name: member.name, id: member.id
                });
            });
            res.json(myTeam);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;