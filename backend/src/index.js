const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const PollRepository = require('./repository/poll');
const WsServerFactory = require('./api/ws/serverFactory');
const RestServerFactory = require('./api/rest/serverFactory');

(async () => {
    let client = await MongoClient.connect(process.env.DSN, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected correctly to MongoDB server");

    const http = require('http');
    const io = require('socket.io')(http);

    const db = client.db('poll');
    const pollRepository = new PollRepository(db);

    const wsServerFactory = new WsServerFactory(
        io,
        pollRepository,
        process.env.CORS_ORIGIN_SCHEMA,
        process.env.CORS_ORIGIN_HOST,
        process.env.WS_PORT,
    );
    const wsServer = wsServerFactory.createServer();
    wsServer.listen();

    const restServerFactory = new RestServerFactory(
        http,
        pollRepository,
        process.env.HTTP_HOST,
        process.env.HTTP_PORT,
        process.env.CORS_ORIGIN_SCHEMA,
        process.env.CORS_ORIGIN_HOST,
    );
    const restServer = restServerFactory.createServer();
    restServer.listen();
})().catch(function (error) {
    console.log(error);
});
