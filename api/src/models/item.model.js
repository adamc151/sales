let mongoose = require("mongoose");
const keys = require("../keys");

const MONGO_USERNAME = keys.mongoUsername;
const MONGO_PASSWORD = keys.mongoPassword;
const MONGO_HOSTNAME = keys.mongoHostname;
const MONGO_PORT = keys.mongoPort;
const MONGO_DB = keys.mongoDatabase;
const MONGO_PROD = keys.mongoProd;
const ATLAS_PASSWORD = keys.atlasPassword;
const ATLAS_USERNAME = keys.atlasUsername;
const ATLAS_HOSTNAME = keys.atlasHostname;
let url = "";

if (MONGO_PROD == "Atlas") {
  url = `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@${ATLAS_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`
} else if (MONGO_PROD == "true") {
  url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
} else {
  url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
}
console.log(url);

setInterval(() => {
  mongoose.connect(url);
}, 10000);

let itemSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      require: true,
    },
    paymentMethod: {
      type: String,
      require: false,
    },
    type: {
      type: String,
      require: true
    },
    voucherType: {
      type: String,
      require: false
    },
    paymentStatus: {
      type: String,
      require: false
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
    user: {
      type: String,
      require: false,
    },
    shop_id: {
      type: String,
      require: true,
    }
  },
  { collection: "items" }
);

let tillFloatSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      require: false,
    },
    dateTime: {
      type: Date,
      require: false,
    },
    shop_id: {
      type: String,
      require: true,
    }
  },
  { collection: "tillFloat" }
);

let notificationsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      require: false,
    },
    dateTime: {
      type: Date,
      require: false,
    },
    shop_id: {
      type: String,
      require: true,
    }
  },
  { collection: "notifications" }
);

let teamMembersSchema = new mongoose.Schema(
  {
    shop_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  { collection: "teamMembers" });


let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    joined: {
      type: Date,
      require: true,
    },
    shops: [{
      shop_id: String,
      shopName: String,
      staffEmail: String
    }]
  },
  { collection: "users" }
);

let voucherSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
    vouchers: [{
      type: {
        type: String,
        require: true,
      },
      value: {
        type: Number,
        require: true,
      },
      vouchers: [{
        type: {
          type: String,
          require: true,
        },
        value: {
          type: Number,
          require: true,
        }
      }]
    }]
  },
  { collection: "vouchers" });


let versionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      require: true,
    }
  },
  { collection: "version" });

module.exports = {
  items: mongoose.model("Item", itemSchema),
  tillFloat: mongoose.model("TillFloat", tillFloatSchema),
  notifications: mongoose.model("Notifications", notificationsSchema),
  teamMembers: mongoose.model("TeamMembers", teamMembersSchema),
  users: mongoose.model("Users", userSchema),
  vouchers: mongoose.model("Vouchers", voucherSchema),
  version: mongoose.model("Version", versionSchema),
};
