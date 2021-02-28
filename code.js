
const http = require('http');
const https = require('https'); // require initiates a module from node.js



http.createServer(function (req,res) { // create server with http module // req = client request
    res.writeHead(200, {'Content-type': 'text/html'}); // define header (200 = all OK)
    res.write("The date and time is currently: "+ dt.myDateTime()); // Output
    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    console.log(url);
    res.end("request made");
}).listen(port); // what port the server should listen to

