let ItemModel = require("../models/item.model").items;
let TillFloatModel = require("../models/item.model").tillFloat;
let NotificationsModel = require("../models/item.model").notifications;
let TeamMembersModel = require("../models/item.model").teamMembers;
let UserModel = require("../models/item.model").users;
let express = require("express");
let router = express.Router();
// const keys = require("../keys");

const generateHash = (s) => {
  var hash = 0, i, chr, len;
  if (s.length === 0) return hash;
  for (i = 0, len = s.length; i < len; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

router.post("/addUser", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  let model = new UserModel({ email: req.email, shop_id: generateHash(req.email), isOwner: true });
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

router.get("/items", async (req, res) => {

  const user = await UserModel.findOne({ email: req.email });

  if (!req.isOwner) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    ItemModel.find({ dateTime: { $gt: d }, shop_id: user && user.shop_id })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    ItemModel.find({ shop_id: user && user.shop_id })
      .sort({ dateTime: 1 })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

router.post("/additem", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is missing");
  }

  const user = await UserModel.findOne({ email: req.email });
  console.log('yooo user', user);

  let model = new ItemModel({ ...req.body, shop_id: user && user.shop_id });
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
  TeamMembersModel.find({ "shop_id": "111" })
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
