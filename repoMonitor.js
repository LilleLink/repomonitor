/* Custom module with funciontality to monitor github repositiories*/

// Dependencies
const request = require('sync-request'); 
const readline = require('readline-sync');
const chalk = require('chalk');

// Constant definitinos
var username;
var repositoryName;
var gitOptions;
var url;
var currentSHA;

// Functions

// Basic input funcionality
function getFromTerminal(question) {
    return readline.question(question);
}

// Returns a simple JSON object with the repositories
function getRepositories(username) {
    var info = getJSON("https://api.github.com/users/"+username+"/repos", gitOptions);
    return info;
}

//Prints list of repositories
function listRepositories(username) {
    var info = getRepositories();
    for (var i = 0; i < info.length; i++) {
        console.log(chalk.green(info[i].name));
    }
}

//Returns the author of a git commit, given a specific SHA-code
function getCommitAuthor(sha) {
    let commit = getJSON('https://api.github.com/repos/'+username+'/'+repositoryName+'/commits/'+sha, gitOptions);
    return commit.commit.author;
}

// Makes a GET request with the passed set of gitoptions, to the given URL.
function getJSON(URL, gitoptions) {
    return JSON.parse(request('GET', URL, gitoptions).getBody());
}

// Makes a GET request to the chosen URL (getJSON) and returns the latest commit sha
function checkSHA(urlpar) {
    var info = getJSON(urlpar, gitOptions); // HTTP request to get the info
    info = info.find(item=>item.name=='master'); // Finds master branch

    return info.commit["sha"]; // Returns latest sha of master branch
}

// Function that initiates the gitOptions variable
function initAPIOptions(token) {
    gitOptions = {
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token '+token
        }
    };
}

// Function that initiates the URL to check commits from
function initURL(username, reposName) {
    this.username = username;
    this.repositoryName = reposName;
    url = "https://api.github.com/repos/"+username+"/"+reposName+"/branches"; // URL to check for branches
}

// Initiates the monitor in the web interface
function initiate() {
    if(gitOptions != null && url != null) {
        currentSHA = checkSHA(url); // initiates currentSha value because checkCommit needs initial value
        setInterval(checkCommit, 5000); // Latter parameter is parserate
    } else {
        console.log("Error, API header or URL invalid");
    }
}

// Initiates the repository-monitor in the CLI interface
function initMonitor() {
    // Gets the required information from the user to monitor a repository
    var apiToken = getFromTerminal("Enter API-token > ");
    gitOptions = {
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token '+apiToken
        }
    };

    username = getFromTerminal("Enter GitHub username > ");
    listRepositories(username);
    repositoryName = getFromTerminal("Enter repository name > ");

    url = "https://api.github.com/repos/"+username+"/"+repositoryName+"/branches"; // URL to check for branches

    currentSHA = checkSHA(url); // initiates currentSha value because checkCommit needs initial value
    setInterval(checkCommit, 5000); // Latter parameter is parserate

    console.log("Monitoring "+repositoryName+"..."); // User feedback is always pog
}

function checkCommit() {
    let latestSHA = checkSHA(url);
    if (currentSHA != latestSHA) {
        console.log(chalk.red("NEW COMMIT TO MASTER BY "+getCommitAuthor(latestSHA)["name"]));
        currentSHA = latestSHA;
    } else {
        //console.log("CHECKING...");
    }
}

// Bundle-ing the module together
exports.checkCommit = this.checkCommit;
exports.initMonitor = initMonitor;
exports.checkSHA = checkSHA;
exports.getJson = getJSON;
exports.getCommitAuthor = getCommitAuthor;
exports.listRepositories = listRepositories;
exports.getFromTerminal = getFromTerminal;
exports.getRepositories = getRepositories;
exports.initAPIOptions = initAPIOptions;
exports.initURL = initURL;
exports.initiate = initiate;