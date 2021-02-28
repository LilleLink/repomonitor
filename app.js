// Modules
const request = require('sync-request'); 
const readline = require('readline-sync');
const chalk = require('chalk');

// Variables
const parseRate = 5000; // set to lower than 5000 requests per hour
var URL;
var username;
var reposName;
var currentSHA;
var gitOptions = {
    headers: {
        'User-Agent': 'request',
        'Authorization': 'token '+getFromTerminal("Auth token > ")
    }
};

/*------------------MAIN PROGRAM-------------------*/
URL = buildURL();
currentSHA = checkSHA(URL);
mainLoop();
setInterval(mainLoop, parseRate);

function mainLoop() {
    let latestSHA = checkSHA(URL);
    if (currentSHA != latestSHA) {
        console.log(chalk.red("NEW COMMIT TO MASTER BY "+getCommitAuthor(latestSHA)["name"]));
        currentSHA = latestSHA;
    } else {
        console.log("CHECKING...");
        //test
    }
}

/*-----------------HELPER FUNCTIONS--------------------*/

// Makes a GET request to the chosen URL (getJSON) and returns the latest commit sha
function checkSHA(urlpar) {
    let info = getJSON(urlpar, gitOptions);
    for (let i = 0; i < info.length; i++) {
        let current = info[i];
        if (current["name"] == "master") {
            let masterBranch = info[i];
            return masterBranch.commit["sha"];
        }
    }
    return null;
}

// Makes a GET request with the passed set of options, to the given URL.
function getJSON(URL, options) {
    return JSON.parse(request('GET', URL, options).getBody());
}

//Returns the author of a git commit, given a specific SHA-code
function getCommitAuthor(sha) {
    let commit = getJSON('https://api.github.com/repos/'+username+'/'+reposName+'/commits/'+sha, gitOptions);
    return commit.commit.author;
}

//IO
function getFromTerminal(question) {
    return readline.question(question);
}

// Function to generate API URL
function buildURL() {
    username = getFromTerminal("Github username > ");
    listRepositories(username);
    reposName = getFromTerminal("Repository name > ");
    return "https://api.github.com/repos/"+username+"/"+reposName+"/branches";
}

//Prints list of repositories
function listRepositories(username) {
    let info = getJSON("https://api.github.com/users/"+username+"/repos", gitOptions);
    for (let i = 0; i < info.length; i++) {
        console.log(chalk.green(info[i].name));
    }
}
