import React from "react";
import io from "socket.io-client";
import {Route, RouteComponentProps} from "react-router";
import NoMatch from "./NoMatch";
import Poll from "./Poll";

type State = {
    possibleAnswers: Array<Answer>,
    question: string,
    results: Array<RespondentAnswer>,
    isPollFound: boolean,
    isLoading: boolean,
}

class PollPage extends React.Component<RouteComponentProps<PollId>, State> {
    state = {
        possibleAnswers: [],
        question: '',
        results: [],
        isPollFound: false,
        isLoading: true,
    };

    private ws: SocketIOClient.Socket = io('http://127.0.0.1:8081/poll', {autoConnect: false});

    constructor(props: RouteComponentProps<PollId>) {
        super(props);

        this.ws.on('message', (msg: RespondentAnswer) => {
            this.setState((state: State): { results: Array<RespondentAnswer> } => ({
                    results: state.results.concat(msg),
                })
            );
        });

        this.ws.on('connect', () => {
            this.setState({
                results: [],
            });
            this.ws.emit('room', this.props.match.params.pollId);
        });

        this.ws.on('disconnect', () => {
            this.setState({results: []});
        });
    }

    componentDidUpdate(prevProps: Readonly<RouteComponentProps<PollId>>): void {
        if (prevProps.match.params.pollId === this.props.match.params.pollId) {
            return;
        }

        this.setState({
            isLoading: true,
            isPollFound: false
        });

        this.loadPollData();
    }

    componentDidMount(): void {
        this.loadPollData();
    }

    private loadPollData() {
        fetch("http://localhost:8080/poll/" + this.props.match.params.pollId)
            .then(res => res.json())
            .then((result) => {
                    if (!result.success) {
                        this.setState({
                            isLoading: false,
                            isPollFound: false,
                        });

                        return;
                    }

                    this.setState({
                        isLoading: false,
                        isPollFound: true,
                        possibleAnswers: result.data.possibleAnswers,
                        question: result.data.question
                    });

                    this.ws.connect();
                }
            )
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>...loading</div>
            );
        }

        if (this.state.isPollFound) {
            return (
                <Poll
                    ws={this.ws}
                    question={this.state.question}
                    possibleAnswers={this.state.possibleAnswers}
                    results={this.state.results}
                    pollId={this.props.match.params.pollId}
                />
            );
        }

        return (
            <Route component={NoMatch}/>
        )
    }
}

export default PollPage;