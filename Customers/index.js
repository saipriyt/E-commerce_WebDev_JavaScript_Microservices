const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./connection');
const customerRoute = require('./customer');
const app = express();

//To read the data in json file
app.use(express.json());
app.use(customerRoute);


module.exports = app;