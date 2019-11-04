const http = require('http');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

(async () => {
    let client = await MongoClient.connect(process.env.DSN, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected correctly to MongoDB server");

    const db = client.db('poll');
    const io = require('./wsServer')(http, db);
    const server = require('./server')(http, db);
    io.listen(process.env.WS_PORT);
    server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
        console.log(`Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/`);
    });
})().catch(function (error) {
    console.log(error.stack);
});
