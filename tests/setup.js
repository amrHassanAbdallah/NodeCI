jest.setTimeout(30000);

require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

//user promis and ignore deprecation
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient: true});
