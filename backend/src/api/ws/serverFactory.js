const ObjectID = require('mongodb').ObjectID;
const Server = require('./server');

module.exports = class {
    constructor(io, pollRepository, corsOriginSchema, corsOriginHost, wsPort) {
        this.io = io;
        this.pollRepository = pollRepository;
        this.corsOriginSchema = corsOriginSchema;
        this.corsOriginHost = corsOriginHost;
        this.wsPort = wsPort;
    }

    createServer() {
        const namespace = this.io.of('/poll');

        this.io.origins((origin, callback) => {
            if (origin !== `${this.corsOriginSchema}://${this.corsOriginHost}`) {
                return callback('origin not allowed', false);
            }
            callback(null, true);
        });

        namespace.on('connection', socket => {
            console.log('New client connected');

            socket.on('message', msg => {
                socket.emit('message', msg.answer);
                socket.to(msg.room).emit('message', msg.answer);

                this.pollRepository.addAnswer(ObjectID(msg.room), msg.answer);
            });

            socket.on('room', async room => {
                socket.join(room);

                let answersDocument = await this.pollRepository.findOneById(ObjectID(room));

                if (null === answersDocument) {
                    return;
                }

                let answers = [];
                if (typeof answersDocument == 'object' && answersDocument.hasOwnProperty('answers')) {
                    answers = answersDocument.answers;
                }

                for (let item of answers) {
                    socket.emit('message', item);
                }
            });
        });

        return new Server(this.io, this.wsPort);
    }
};
