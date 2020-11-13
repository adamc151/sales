let express = require("express");
let app = express();
let itemRoute = require("./routes/item");
let userRoute = require("./routes/users");
let teamMembersRoute = require("./routes/teamMembers");
let notificationsRoute = require("./routes/notifications");
let tillFloatRoute = require("./routes/tillFloat");


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
      const ownerUser = await UserModel.findOne({ email: firebaseUser.email });
      console.log('yoooo ownerUser', ownerUser);
      req.isOwner = ownerUser && ownerUser.isOwner;
      req.shop_ids = ownerUser && ownerUser.shop_ids;
      req.email = firebaseUser && firebaseUser.email;
      req.apiKey = apiKey;
      next();
    } catch (err) {
      res.status(500).json({ error: "Not Authorized" });
    }
  }
});

app.use(userRoute);
app.use(itemRoute);
app.use(teamMembersRoute);
app.use(notificationsRoute);
app.use(tillFloatRoute);

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
