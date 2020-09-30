let express = require("express");
let jwt = require("jsonwebtoken");
let app = express();
let itemRoute = require("./routes/item");
let path = require("path");
let bodyParser = require("body-parser");
const cors = require("cors");
const keys = require("./keys");
const mockData = require("./mockData.json");
const admin = require("firebase-admin");

admin.initializeApp();

let jwtSecret = keys.jwtSecret;

const checkAuth = async (idToken) => {
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded.owner;
  // if (decoded.owner !== true) {
  //   throw new Error("User does not have the right privileges");
  // }
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
    if (!idToken) {
      res.status(500).json({ error: "ID token not specified" });
    }
    try {
      const isOwner = await checkAuth(idToken);
      req.isOwner = isOwner;
      next();
    } catch (err) {
      res.status(500).json({ error: "Not Authorized" });
    }
  }
});

app.use(itemRoute);

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
