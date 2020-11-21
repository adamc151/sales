let express = require("express");
let app = express();
let itemRoute = require("./routes/item");
let userRoute = require("./routes/users");
let teamMembersRoute = require("./routes/teamMembers");
let notificationsRoute = require("./routes/notifications");
let tillFloatRoute = require("./routes/tillFloat");
let vouchersRoute = require("./routes/vouchers");

let path = require("path");
let bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
let UserModel = require("./models/item.model").users;

admin.initializeApp();

const checkAuth = async (idToken) => {
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded;
};

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});

app.use(async (req, res, next) => {
  if (true) {
    const idToken = req.header("X-Firebase-ID-Token");
    const apiKey = req.header("API-KEY");
    if (!idToken) {
      res.status(500).json({ error: "ID token not specified" });
    }
    try {
      const firebaseUser = await checkAuth(idToken);
      console.log('yoooo firebaseUser', firebaseUser);

      const mongoUser = await UserModel.findOne({ $or: [{ email: firebaseUser.email }, { "shops.staffEmail": firebaseUser.email }] });

      console.log('yoooo mongoUser', mongoUser);

      req.shop_id = mongoUser && mongoUser.shops[0].shop_id;
      req.shopName = mongoUser && mongoUser.shops[0].shopName;
      req.staffEmail = mongoUser && mongoUser.shops[0].staffEmail;
      req.isOwner = mongoUser && mongoUser.email === firebaseUser.email;
      req.email = firebaseUser && firebaseUser.email;
      req.apiKey = apiKey;

      console.log('yooooo req.url', req.url);
      console.log('yooooo req.shop_id', req.shop_id);
      console.log('yooooo req.email', req.email);


      if ((req.url === '/addUser' || req.url === '/user' || req.shop_id) && req.email) {
        next();
      } else {
        console.log('yooo err 1', (req.url === '/addUser' || req.shop_id) && req.email);
        res.status(500).json({ error: "Not Authorized" });
      }

    } catch (err) {
      console.log('yooo err 2', err);
      res.status(500).json({ error: "Not Authorized" });
    }
  }
});

app.use(userRoute);
app.use(itemRoute);
app.use(teamMembersRoute);
app.use(notificationsRoute);
app.use(tillFloatRoute);
app.use(vouchersRoute);

app.use(express.static("public"));

app.use((req, res, next) => {
  res.status(404).send("We think you are lost");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.sendFile(path.join(__dirname, "../public/500.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server has started on ${PORT}`));
