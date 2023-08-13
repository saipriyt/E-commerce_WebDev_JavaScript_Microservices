const express = require('express');
const booksbffRoute = require('./booksbff');
const app = express();

//To read the data in json file
app.use(express.json());
app.use(booksbffRoute);


module.exports = app;