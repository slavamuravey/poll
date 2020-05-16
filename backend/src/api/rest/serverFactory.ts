import finalhandler from 'finalhandler';
const router = require('router')();
import Server from './server';
import HttpStatus from 'http-status-codes';
import {ObjectId} from 'mongodb';

export default class {
    constructor(
        private http: any,
        private pollRepository: any,
        private readonly httpHost: any,
        private readonly httpPort: any,
        private readonly corsOriginSchema: any,
        private readonly corsOriginHost: any
    ) {
        this.http = http;
        this.pollRepository = pollRepository;
        this.httpHost = httpHost;
        this.httpPort = httpPort;
        this.corsOriginSchema = corsOriginSchema;
        this.corsOriginHost = corsOriginHost;
    }

    createServer() {
        router.get('/poll/:id', async (req: any, res: any) => {
            try {
                let result = await this.pollRepository.findOneByIdProjection(new ObjectId(req.params.id), {
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
        router.post('/poll', (req: any, res: any) => {
            const bodyChunks: any[] = [];
            req.on('data', function (chunk: any) {
                bodyChunks.push(chunk);
            });

            req.on('end', async () => {
                const bodyString = Buffer.concat(bodyChunks).toString();
                const body = JSON.parse(bodyString);

                const result = await this.pollRepository.addPoll(body.question, body.possibleAnswers);

                res.end(JSON.stringify({
                    data: {
                        id: result.insertedId
                    },
                    success: true,
                }))
            });
        });

        return new Server(this.http.createServer((req: any, res: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", `${this.corsOriginSchema}://${this.corsOriginHost}`);
            router(req, res, finalhandler(req, res));
        }), this.httpHost, this.httpPort);
    }
};