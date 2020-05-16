import {ObjectId} from 'mongodb';
import Server from './server';

export default class {
    constructor(
        private readonly io: any,
        private pollRepository: any,
        private readonly corsOriginSchema: any,
        private readonly corsOriginHost: any,
        private readonly wsPort: any
    ) {
        this.io = io;
        this.pollRepository = pollRepository;
        this.corsOriginSchema = corsOriginSchema;
        this.corsOriginHost = corsOriginHost;
        this.wsPort = wsPort;
    }

    createServer() {
        const namespace = this.io.of('/poll');

        this.io.origins((origin: any, callback: any) => {
            if (origin !== `${this.corsOriginSchema}://${this.corsOriginHost}`) {
                return callback('origin not allowed', false);
            }
            callback(null, true);
        });

        namespace.on('connection', (socket: any) => {
            console.log('New client connected');

            socket.on('message', (msg: any) => {
                socket.emit('message', msg.answer);
                socket.to(msg.room).emit('message', msg.answer);

                this.pollRepository.addAnswer(new ObjectId(msg.room), msg.answer);
            });

            socket.on('room', async (room: any) => {
                socket.join(room);

                let answersDocument = await this.pollRepository.findOneById(new ObjectId(room));

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
