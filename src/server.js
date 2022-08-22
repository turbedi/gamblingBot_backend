const http = require("http");
const url = require("url");
const { Client } = require('pg');
const queries = require('./queryMethods.js');
const host = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    var urlPath = url.parse(req.url, true);
    //console.log(urlPath.query);
    var urlQuery = urlPath.query;
    if (checkPathStart(urlPath.pathname) === true) {
        console.log("Request with correct path start");
    }
    else {
        console.log(`Wrong path: ${urlPath.path}`);
        res.writeHead(400);
        res.end("Wrong path");
        return;
    }
    //console.log(urlQuery);
    if (checkQuery(urlQuery) === false) {
        console.log(`Wrong query: ${urlPath.path}`)
        res.writeHead(400);
        res.end("Wrong query");
        return;
    }

    var playerId = urlQuery.playerId;
    var groupId = urlQuery.groupId;
    var name = urlQuery.name;
    var playValue = parseInt(urlQuery.playValue);
    if (playValue === 1 || playValue === 22 || playValue === 42 || playValue === 64) { // Winning values
        //GEWONNEN
        queries.winningPlay(playerId, groupId, name);
        queries.getWins(playerId, groupId);
        queries.getGroupWinsOfPlayer(playerId);
        queries.getGroupRanking(groupId);

        console.log('------------\n');   
    }

    res.writeHead(200);
    res.end("Query successful");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
    connectToDB();
});

const checkPathStart = function(urlPath) {
    return urlPath === "/players/play";
}

const checkQuery = function(urlQuery) {
    var playerId = urlQuery.playerId;
    var groupId = urlQuery.groupId;
    var name = urlQuery.name;
    var playValue = urlQuery.playValue;
    if (playerId === undefined || groupId === undefined || name === undefined || playValue === undefined) {
        console.log("Undefined")
        return false;
    }
    return true;
}

const connectToDB = function() {
    pool = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'gamblingbot_db',
        password: 'test',
        port: 5432,
      })
      pool.connect(function(err) {
        if (err) throw err;
        console.log("Connected to database!");
      });     
}