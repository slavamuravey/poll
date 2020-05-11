module.exports = class {
    constructor(db) {
        this.db = db;
    }

    addAnswer(id, answer) {
        this.db.collection('poll').updateOne({
            _id: id
        }, {
            $push: {
                answers: answer
            }
        }, {
            upsert: true
        });
    }

    findOneById(id) {
        return this.db.collection('poll').findOne({
            _id: id
        });
    }

    findOneByIdProjection(id, fields) {
        return this.db.collection('poll').findOne({
            _id: id
        }, {
            projection: fields
        });
    }

    addPoll(question, possibleAnswers) {
        return this.db.collection('poll').insertOne({
            question: question,
            possibleAnswers: possibleAnswers,
            answers: []
        })
    }
};