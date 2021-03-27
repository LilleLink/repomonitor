// Modules
const request = require('sync-request'); 
const readline = require('readline-sync');
const chalk = require('chalk');
const server = require('./server');
const monitor = require('./repoMonitor'); 

monitor.initMonitor();
server.initiateServer();
