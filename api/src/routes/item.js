let ItemModel = require("../models/item.model").items;
let TillFloatModel = require("../models/item.model").tillFloat;
let NotificationsModel = require("../models/item.model").notifications;
let TeamMembersModel = require("../models/item.model").teamMembers;
let express = require("express");
let router = express.Router();
// const keys = require("../keys");

router.get("/notifications", (req, res) => {
  if (req.isOwner) {
    NotificationsModel.find()
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

  let model = new NotificationsModel(req.body);
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
    NotificationsModel.deleteMany({})
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

router.get("/tillfloat", (req, res) => {
  TillFloatModel.find()
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
    const tillFloat = await TillFloatModel.findOne();

    if (tillFloat) {
      tillFloat.value = req.body.value;
      tillFloat.dateTime = req.body.dateTime;
      await tillFloat.save();
    } else {
      let model = new TillFloatModel(req.body);
      await model.save();
    }

    const doc = await TillFloatModel.find();
    return res.status(201).send(doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/items", (req, res) => {
  if (!req.isOwner) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    ItemModel.find({ dateTime: { $gt: d } })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    ItemModel.find()
      .sort({ dateTime: 1 })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

router.post("/additem", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  let model = new ItemModel(req.body);
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

router.put('/editItem', (req, res) => {
  if (!req.query.item_id) {
    return res.status(400).send('missing URL param: item_id');
  }
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  ItemModel.findOneAndUpdate({
    _id: req.query.item_id
  }, req.body, { new: true })
    .then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc);
      }
      res.status(201).send(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

router.post("/additems", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  ItemModel
    .insertMany(req.body)
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

router.delete("/removeitem", (req, res) => {
  if (!req.query.id) {
    return res.status(400).send("missing URL param: id");
  }
  ItemModel.findOneAndRemove({
    _id: req.query.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/team", (req, res) => {
    TeamMembersModel.find({"shop_id": "111"})
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
