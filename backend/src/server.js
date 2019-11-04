const finalhandler = require('finalhandler');
const router = require('router')();

module.exports = function (http, db) {
    require('./pollApi')(router, db);

    return http.createServer((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", `${process.env.CORS_ORIGIN_SCHEMA}://${process.env.CORS_ORIGIN_HOST}`);
        router(req, res, finalhandler(req, res));
    });
}
