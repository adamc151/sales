let mongoose = require("mongoose");
const keys = require("../keys");

const MONGO_USERNAME = keys.mongoUsername;
const MONGO_PASSWORD = keys.mongoPassword;
const MONGO_HOSTNAME = keys.mongoHostname;
const MONGO_PORT = keys.mongoPort;
const MONGO_DB = keys.mongoDatabase;
const MONGO_PROD = keys.mongoProd;
let url = "";

if (MONGO_PROD == "Atlas") {
  url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`;
} else if (MONGO_PROD == "true") {
  url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
} else {
  url = `mongodb://mongo:${MONGO_PORT}/${MONGO_DB}`;
}
console.log(url);

mongoose.connect(url);

let itemSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      require: false,
    },
    paymentMethod: {
      type: String,
      require: false,
    },
    isExpense: {
      type: Boolean,
      require: false,
    },
    breakdown: {
      lenses: {
        type: Number,
        require: false,
      },
      accessories: {
        type: Number,
        require: false,
      },
      fees: {
        type: Number,
        require: false,
      },
    },
    details: {
      type: String,
      require: false,
    },
    dateTime: {
      type: Date,
      require: false,
    },
  },
  { collection: "items" }
);

let tillFloatSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      require: false,
    },
    name: {
      type: String,
      require: false,
    },
  },
  { collection: "tillFloat" }
);

module.exports = {
  items: mongoose.model("Item", itemSchema),
  tillFloat: mongoose.model("TillFloat", tillFloatSchema),
};
