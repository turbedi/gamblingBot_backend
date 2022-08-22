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

module.exports = { winningPlay, getWins, getGroupWinsOfPlayer, getGroupRanking };