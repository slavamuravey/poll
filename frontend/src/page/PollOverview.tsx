import React from "react";
import {Route, RouteComponentProps} from "react-router";
import PageNotFound from "./PageNotFound";
import Poll from "../component/Poll";

type State = {
    possibleAnswers: Array<Answer>,
    question: string,
    isPollFound: boolean,
    isLoading: boolean,
}

class PollOverview extends React.Component<RouteComponentProps<PollId>, State> {
    state = {
        possibleAnswers: [],
        question: '',
        isPollFound: false,
        isLoading: true,
    };

    componentDidUpdate(prevProps: Readonly<RouteComponentProps<PollId>>): void {
        if (prevProps.match.params.pollId === this.props.match.params.pollId) {
            return;
        }

        this.setState({
            ...this.state,
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
                            ...this.state,
                            isLoading: false,
                            isPollFound: false,
                        });

                        return;
                    }

                    this.setState({
                        ...this.state,
                        isLoading: false,
                        isPollFound: true,
                        possibleAnswers: result.data.possibleAnswers,
                        question: result.data.question
                    });
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
                    question={this.state.question}
                    possibleAnswers={this.state.possibleAnswers}
                    pollId={this.props.match.params.pollId}
                />
            );
        }

        return (
            <Route component={PageNotFound}/>
        )
    }
}

export default PollOverview;