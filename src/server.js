const http = require("http");
const { Client } = require('pg');
const listener = require('./requestListener.js');
const host = 'localhost';
const port = 8080;

const server = http.createServer(listener.requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    connectToDB();
});

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