const express = require('express');
const path = require('path');
const monitor = require('./repoMonitor');
let app = express();  // Getting instance of the express server

exports.initiateServer = function (){
    app.use(express.static('public')); // Serve public file directory to load html/css/js in public folder
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
    app.listen(8080);

    app.get('/monitor', function(req, res) {
        res.redirect("monitor.html"); // Redirect possible since monitor.html is in the statically served dir 
    });

    app.post('/monitor', function(req, res) {
        var token = req.body.githubAPIToken;
        var username = req.body.githubUsername;
        var reposName = req.body.githubRepository;

        /*console.log(token);
        console.log(username);
        console.log(reposName);*/

        monitor.initAPIOptions(token);
        monitor.initURL(username, reposName);
        monitor.initiate();
    });
}