let ItemModel = require("../models/item.model");
let express = require("express");
let router = express.Router();

router.get("/items", (req, res) => {
  console.log("yooo req", req);

  if (!req.isOwner) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    console.log("yoo d", d);
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

module.exports = router;
