function winningPlay(playerId, groupId, name) {
    const fullQuery =
    `DO $$
    BEGIN
    IF EXISTS (SELECT * FROM main2 WHERE playerid = ${playerId} AND groupid = ${groupId}) THEN
        UPDATE main2 SET wincount = wincount + 1, name = '${name}' WHERE playerid = ${playerId} AND groupid = ${groupId};
    ELSE
        INSERT INTO main2(name, wincount, playerid, groupid) VALUES ('${name}', 1, ${playerId}, ${groupId});
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
    const getWinQuery = 
    `
    SELECT wincount FROM main2 WHERE playerid = ${playerId} AND groupid = ${groupId}
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
    const getGroupWithMostWinsQuery =
    `
    SELECT groupid, wincount FROM main2 WHERE playerid = ${playerId} ORDER BY groupid DESC;
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
    const getGroupRankingQuery = 
    `
    SELECT playerid, wincount FROM main2 WHERE groupid = ${groupId} ORDER BY wincount DESC;
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

const checkUrlQuery = function(urlPath, queryObject) {
    if (urlPath.pathname !== "/players/play" || queryObject.playerId === undefined || queryObject.groupId === undefined || queryObject.name === undefined || queryObject.playValue === undefined) {
        return false;
    }
    return true;
}

module.exports = { winningPlay, getWins, getGroupWinsOfPlayer, getGroupRanking, checkUrlQuery };