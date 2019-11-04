const ObjectID = require('mongodb').ObjectID;

module.exports = function (router, db) {
    router.get('/poll/:pollId', async function (req, res) {
        try {
            let result = await db.collection('poll').findOne({_id: ObjectID(req.params.pollId)}, {
                projection: {
                    _id: true,
                    possibleAnswers: true,
                    question: true
                }
            })
            res.end(JSON.stringify({
                data: result,
                success: true
            }));
        } catch (e) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                message: 'Poll is not found',
                success: false
            }));
        }
    })
    router.post('/poll', function (req, res) {
        let body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        });

        req.on('end', async function () {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            const result = await db.collection('poll').insertOne({
                question: body.question,
                possibleAnswers: body.possibleAnswers,
                answers: []
            });

            res.end(JSON.stringify({
                data: {
                    id: result.insertedId
                },
                success: true,
            }))
        });
    });
}