const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./connection');
const bookRoute = require('./book');
const app = express();

//To read the data in json file
app.use(express.json());
app.use(bookRoute);


module.exports = app;