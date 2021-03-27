const http = require('http');
const dt = require('./dateTime');
const fs = require('fs');
const url = require('url');

exports.initiateServer = function () {
    http.createServer(function (req,res) { // create server with http module // req = client request
        fs.readFile('index.html', function(err, data) { // Displays file POG
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
          });
    }).listen(8080); // what port the server should listen to
}