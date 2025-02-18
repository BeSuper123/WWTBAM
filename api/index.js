const serverless = require("serverless-http");
const app = require("../index"); // Import Express app

module.exports = serverless(app);