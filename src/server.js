const http = require("http");
const url = require("url");
const { Client } = require('pg');
const queries = require('./queryMethods.js');
const host = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    var urlPath = url.parse(req.url, true);
    var urlQuery = urlPath.query;
    const queryObject = {
        playerId: urlQuery.playerId,
        groupId: urlQuery.groupId,
        name: urlQuery.name,
        playValue: urlQuery.playValue
    };
    
    if (checkUrlQuery(urlPath, queryObject) === false) {
        console.log(`Wrong URL query: ${urlPath.path}`);
        res.writeHead(400);
        res.end("Wrong URL query");
        return;
    }

    var playValueInt = parseInt(urlQuery.playValue);
    if (playValueInt === 1 || playValueInt === 22 || playValueInt === 42 || playValueInt === 64) { // Winning values
        //GEWONNEN
        queries.winningPlay(queryObject.playerId, queryObject.groupId, queryObject.name);
        queries.getWins(queryObject.playerId, queryObject.groupId);
        queries.getGroupWinsOfPlayer(queryObject.playerId);
        queries.getGroupRanking(queryObject.groupId);

        console.log('------------\n');   
    }

    res.writeHead(200);
    res.end("Query successful");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    connectToDB();
});

const checkUrlQuery = function(urlPath, queryObject) {
    if (urlPath.pathname !== "/players/play" || queryObject.playerId === undefined || queryObject.groupId === undefined || queryObject.name === undefined || queryObject.playValue === undefined) {
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