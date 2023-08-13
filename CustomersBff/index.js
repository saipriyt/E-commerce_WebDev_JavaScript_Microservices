const express = require('express');
const jwt = require('./validjwt');
const customersbffRoute = require('./customersbff');
const app = express();

//To read the data in json file
app.use(express.json());
app.use(jwt);
app.use(customersbffRoute);


module.exports = app;