const serverless = require('serverless-http');
const app = require('../index.js'); // import your Express app

module.exports = serverless(app);