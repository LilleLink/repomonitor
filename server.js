const express = require('express');

exports.initiateServer = function (){
    var app = express();
    app.use(express.static('public'));
    app.listen(8080);
}