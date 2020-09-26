module.exports = {
  // mongoDatabase: process.env.MGDATABASE,
  // mongoPassword: process.env.MGPASSWORD,
  // mongoPort: process.env.MGPORT
  mongoUsername: process.env.MONGO_USERNAME,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHostname: process.env.MONGO_HOSTNAME,
  mongoPort: process.env.MONGO_PORT,
  mongoDatabase: process.env.MONGO_DB,
  mongoProd: process.env.MONGO_PROD,
  jwtSecret: process.env.JWT_SECRET
};