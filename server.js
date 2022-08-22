const http = require("http");
const url = require("url");
const { Client } = require('pg')
const host = 'localhost'
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
        winningPlay(playerId, groupId, name);
        getWins(playerId, groupId);
        getGroupWinsOfPlayer(playerId);
        getGroupRanking(groupId);

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

function winningPlay(playerId, groupId, name) {
    var playerIdInt = parseInt(playerId);
    var groupIdInt = parseInt(groupId);
    const fullQuery =
    `DO $$
    BEGIN
    IF EXISTS (SELECT * FROM main2 WHERE playerid = ${playerIdInt} AND groupid = ${groupIdInt}) THEN
        UPDATE main2 SET wincount = wincount + 1, name = '${name}' WHERE playerid = ${playerIdInt} AND groupid = ${groupIdInt};
    ELSE
        INSERT INTO main2(name, wincount, playerid, groupid) VALUES ('${name}', 1, ${playerIdInt}, ${groupIdInt});
    END IF;
    END $$`
    pool.query(
        fullQuery, (err, res) => {
            if (err) {
                console.log(err.stack);
            } else {
                //console.log(res);
            }
        }
    );
}

function getWins(playerId, groupId) {
    var playerIdInt = parseInt(playerId);
    var groupIdInt = parseInt(groupId);
    const getWinQuery = 
    `
    SELECT wincount FROM main2 WHERE playerid = ${playerIdInt} AND groupid = ${groupIdInt}
    `
    pool.query(
        getWinQuery, (err, res) => {
            if (err) {
                console.log(err.stack);
            } else {
                console.log(`Amount of wins in Group ${groupId}: `);
                console.log(res.rows[0].wincount);
            }
        }
    )
}

function getGroupWinsOfPlayer(playerId) {
    var playerIdInt = parseInt(playerId);
    const getGroupWithMostWinsQuery =
    `
    SELECT groupid, wincount FROM main2 WHERE playerid = ${playerIdInt} ORDER BY groupid DESC;
    `
    pool.query(
        getGroupWithMostWinsQuery, (err, res) => {
            if (err) {
                console.log(err.stack);
            } else {
                console.log(`Wins of Player ${playerId} in the different groups: `);
                console.log(res.rows);
            }
        }
    )
}

function getGroupRanking(groupId) {
    var groupIdInt = parseInt(groupId);
    const getGroupRankingQuery = 
    `
    SELECT playerid, wincount FROM main2 WHERE groupid = ${groupIdInt} ORDER BY wincount DESC;
    `
    pool.query(
        getGroupRankingQuery, (err, res) => {
            if (err) {
                console.log(err.stack);
            } else {
                console.log(`Group ${groupId} ranking: `);
                console.log(res.rows);
            }
        }
    )
}