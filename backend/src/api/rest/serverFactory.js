const finalhandler = require('finalhandler');
const router = require('router')();
const Server = require('./server');
const HttpStatus = require('http-status-codes');
const ObjectID = require('mongodb').ObjectID;

module.exports = class {
    constructor(http, pollRepository, httpHost, httpPort, corsOriginSchema, corsOriginHost) {
        this.http = http;
        this.pollRepository = pollRepository;
        this.httpHost = httpHost;
        this.httpPort = httpPort;
        this.corsOriginSchema = corsOriginSchema;
        this.corsOriginHost = corsOriginHost;
    }

    createServer() {
        router.get('/poll/:id', async (req, res) => {
            try {
                let result = await this.pollRepository.findOneByIdProjection(ObjectID(req.params.id), {
                    _id: true,
                    possibleAnswers: true,
                    question: true
                });
                res.end(JSON.stringify({
                    data: result,
                    success: true
                }));
            } catch (e) {
                res.statusCode = HttpStatus.NOT_FOUND;
                res.end(JSON.stringify({
                    message: 'Poll is not found',
                    success: false
                }));
            }
        });
        router.post('/poll', (req, res) => {
            let body = [];
            req.on('data', function (chunk) {
                body.push(chunk);
            });

            req.on('end', async () => {
                body = Buffer.concat(body).toString();
                body = JSON.parse(body);

                const result = await this.pollRepository.addPoll(body.question, body.possibleAnswers);

                res.end(JSON.stringify({
                    data: {
                        id: result.insertedId
                    },
                    success: true,
                }))
            });
        });

        return new Server(this.http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", `${this.corsOriginSchema}://${this.corsOriginHost}`);
            router(req, res, finalhandler(req, res));
        }), this.httpHost, this.httpPort);
    }
};