export default class {
    constructor(private db: any) {
        this.db = db;
    }

    addAnswer(id: any, answer: any) {
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

    findOneById(id: any) {
        return this.db.collection('poll').findOne({
            _id: id
        });
    }

    findOneByIdProjection(id: any, fields: any) {
        return this.db.collection('poll').findOne({
            _id: id
        }, {
            projection: fields
        });
    }

    addPoll(question: any, possibleAnswers: any) {
        return this.db.collection('poll').insertOne({
            question: question,
            possibleAnswers: possibleAnswers,
            answers: []
        })
    }
};