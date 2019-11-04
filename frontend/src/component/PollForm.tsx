import React, {SyntheticEvent} from 'react'

type Props = {
    pollId: string,
    question: string,
    possibleAnswers: Array<Answer>,
    ws: SocketIOClient.Socket,
}

type State = {
    respondentName: string,
    respondentAnswerIndex: number | undefined,
}

class PollForm extends React.Component<Props, State> {
    state = {
        respondentName: '',
        respondentAnswerIndex: undefined,
    };

    constructor(props: Props) {
        super(props);
        this.changeAnswer = this.changeAnswer.bind(this as PollForm);
        this.submitAnswer = this.submitAnswer.bind(this as PollForm);
        this.changeRespondentName = this.changeRespondentName.bind(this as PollForm);
    }

    private changeAnswer(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            respondentAnswerIndex: +e.target.value
        });
    }

    private submitAnswer(e: SyntheticEvent) {
        e.preventDefault();

        if (this.state.respondentName.trim() === '') {
            alert('empty respondent name');

            return;
        }

        if (undefined === this.state.respondentAnswerIndex) {
            alert('empty answer');

            return;
        }

        this.props.ws.emit('message', {
            answer: {
                answerIndex: this.state.respondentAnswerIndex,
                respondentName: this.state.respondentName
            },
            room: this.props.pollId
        });
    }

    private changeRespondentName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            respondentName: e.target.value
        });
    }

    render() {
        return (
            <form>
                <div><span>question: </span><span>{this.props.question}</span></div>
                <div><span>your name: </span><input type="text" onChange={this.changeRespondentName} value={this.state.respondentName}/></div>
                <div>
                    {this.props.possibleAnswers.map((value: Answer, index) => (
                        <span key={index}>
                            <input
                                type="radio"
                                value={index}
                                onChange={this.changeAnswer}
                                checked={this.state.respondentAnswerIndex === index}
                            />
                            {value.text}
                        </span>
                    ))}
                </div>
                <div>
                    <input type="submit" value="submit" onClick={this.submitAnswer}/>
                </div>
            </form>
        );
    }
}

export default PollForm;