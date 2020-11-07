let ItemModel = require("../models/item.model").items;
let express = require("express");
let router = express.Router();

router.get("/items", async (req, res) => {

  if (!req.isOwner) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    ItemModel.find({ dateTime: { $gt: d }, shop_id: { $in: req.shop_ids } })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    ItemModel.find({ shop_id: { $in: req.shop_ids } })
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

  let model = new ItemModel({ ...req.body, shop_id: req.shop_ids[0] });
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

module.exports = router;
