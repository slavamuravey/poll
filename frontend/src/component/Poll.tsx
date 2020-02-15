import React from "react";
import RespondentsAnswers from './RespondentsAnswers';
import AddRespondentAnswerForm from "./AddRespondentAnswerForm";
import io from "socket.io-client";

type Props = {
    pollId: string,
    possibleAnswers: Array<Answer>,
    question: string,
}

type State = {
    results: Array<RespondentAnswer>,
}

class Poll extends React.Component<Props, State> {
    state = {
        results: [],
    };

    private ws: SocketIOClient.Socket = io('http://127.0.0.1:8081/poll', {autoConnect: false});

    constructor(props: Props) {
        super(props);

        this.ws.on('message', (msg: RespondentAnswer) => {
            this.setState((state: State): { results: Array<RespondentAnswer> } => ({
                    results: state.results.concat(msg),
                })
            );
        });

        this.ws.on('connect', () => {
            this.setState({
                ...this.state,
                results: [],
            });
            this.ws.emit('room', this.props.pollId);
        });

        this.ws.on('disconnect', () => {
            this.setState({
                ...this.state,
                results: []
            });
        });
    }

    componentDidMount(): void {
        this.ws.connect();
    }

    componentWillUnmount(): void {
        this.ws.disconnect();
    }

    render() {
        return (
            <div>
                <AddRespondentAnswerForm
                    pollId={this.props.pollId}
                    possibleAnswers={this.props.possibleAnswers}
                    question={this.props.question}
                    ws={this.ws}
                />
                <RespondentsAnswers
                    possibleAnswers={this.props.possibleAnswers}
                    results={this.state.results}
                />
            </div>
        );
    }
}

export default Poll;