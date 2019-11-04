import React from "react";
import RespondentsAnswers from './RespondentsAnswers';
import PollForm from "./PollForm";

type Props = {
    pollId: string,
    possibleAnswers: Array<Answer>,
    question: string,
    results: Array<RespondentAnswer>,
    ws: SocketIOClient.Socket,
}

class Poll extends React.Component<Props> {
    componentWillUnmount(): void {
        this.props.ws.disconnect();
    }

    render() {
        return (
            <div>
                <PollForm
                    pollId={this.props.pollId}
                    possibleAnswers={this.props.possibleAnswers}
                    question={this.props.question}
                    ws={this.props.ws}
                />
                <RespondentsAnswers
                    possibleAnswers={this.props.possibleAnswers}
                    results={this.props.results}
                />
            </div>
        );
    }
}

export default Poll;