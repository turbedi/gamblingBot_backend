const url = require("url");
const queries = require('./queryMethods.js');

const requestListener = function (req, res) {
    var urlPath = url.parse(req.url, true);
    var urlQuery = urlPath.query;
    var queryObject = {
        playerId: urlQuery.playerId,
        groupId: urlQuery.groupId,
        name: urlQuery.name,
        playValue: urlQuery.playValue
    };
    
    if (queries.checkUrlQuery(urlPath, queryObject) === false) {
        console.log(`Wrong URL query: ${urlPath.path}`);
        res.writeHead(400);
        res.end("Wrong URL query");
        return;
    }

    var playValueInt = parseInt(urlQuery.playValue);
    if (playValueInt === 1 || playValueInt === 22 || playValueInt === 42 || playValueInt === 64) { // Winning values
        console.log('Gewonnen!!');
        queries.winningPlay(queryObject.playerId, queryObject.groupId, queryObject.name);
        queries.getWins(queryObject.playerId, queryObject.groupId);
        queries.getGroupWinsOfPlayer(queryObject.playerId);
        queries.getGroupRanking(queryObject.groupId);
        console.log('------------\n');   
    } else {
        console.log('Verloren :(');
    }

    res.writeHead(200);
    res.end("Query successful");
};

module.exports = { requestListener };