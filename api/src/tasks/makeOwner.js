const admin = require("firebase-admin");
const serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

if (process.argv.length !== 3) {
  throw Error("Invalid use of makeOwner. Usage: node makeOwner.js <email>");
}
const email = process.argv[2];

const grantOwnerRole = async (email) => {
  const user = await admin.auth().getUserByEmail(email);
  return admin.auth().setCustomUserClaims(user.uid, {
    owner: true,
  });
};

grantOwnerRole(email)
  .then((res) => {
    console.log(`User ${email} has been given owner role`);
    process.exit(0);
  })
  .catch((err) => {
    console.log("Failed to grant user owner role: " + err);
    process.exit(1);
  });
