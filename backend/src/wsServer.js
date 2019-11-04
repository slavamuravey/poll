const ObjectID = require('mongodb').ObjectID;

module.exports = function (http, db) {
    const io = require('socket.io')(http);
    const nsp = io.of('/poll');

    io.origins((origin, callback) => {
        if (origin !== `${process.env.CORS_ORIGIN_SCHEMA}://${process.env.CORS_ORIGIN_HOST}`) {
            return callback('origin not allowed', false);
        }
        callback(null, true);
    });

    nsp.on('connection', function (socket) {
        console.log('New client connected');

        socket.on('message', function (msg) {
            socket.emit('message', msg.answer);
            socket.to(msg.room).emit('message', msg.answer);

            db.collection('poll').updateOne({
                _id: ObjectID(msg.room)
            }, {
                $push: {
                    answers: msg.answer
                }
            }, {
                upsert: true
            });
        });

        socket.on('room', async function (room) {
            socket.join(room);

            let answersDocument = await db.collection('poll').findOne({
                _id: ObjectID(room)
            });

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
    })

    return io;
}

