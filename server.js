const express = require('express');
const dt = require('./dateTime');
const fs = require('fs');
const url = require('url');

exports.initiateServer = function (){
    var app = express();
    app.use(express.static('.'));
    app.listen(8080);
}

