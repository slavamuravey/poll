import {RouteComponentProps, withRouter} from "react-router";
import React, {SyntheticEvent} from "react";
import AnswerList from "./AnswerList";

type State = {
    question: string,
    answers: Array<Answer>,
}

class CreatePollForm extends React.Component<RouteComponentProps, State> {
    state = {
        question: '',
        answers: [],
    };

    constructor(props: RouteComponentProps) {
        super(props);
        this.addAnswer = this.addAnswer.bind(this as CreatePollForm);
        this.submitForm = this.submitForm.bind(this as CreatePollForm);
        this.changeQuestion = this.changeQuestion.bind(this as CreatePollForm);
    }

    private addAnswer(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        this.setState((state: State): {answers: Array<Answer>} => ({
            answers: state.answers.concat({
                text: ''
            })
        }));
    }

    private submitForm(e: SyntheticEvent) {
        e.preventDefault();

        if (this.state.answers.length === 0) {
            alert('no answers');

            return;
        }

        if (this.state.answers.find(answer => (answer as Answer).text.trim() === '')) {
            alert('has empty answers');

            return;
        }

        if (this.state.question.trim() === '') {
            alert('empty question');

            return;
        }

        fetch('http://localhost:8080/poll', {
            method: 'POST',
            body: JSON.stringify({
                question: this.state.question,
                possibleAnswers: this.state.answers,
                answers: []
            })
        })
        .then((res) => res.json())
        .then((res) => {
            this.props.history.push(`/poll/${res.data.id}`);
        });
    }

    private changeAnswerText(e: React.ChangeEvent<HTMLInputElement>, i: number) {
        let answers = this.state.answers.slice();
        let answer: Answer = answers[i];
        answer.text = e.target.value;

        this.setState({
            answers: answers
        });
    }

    private removeAnswer(e: React.MouseEvent<HTMLButtonElement>, i: number) {
        e.preventDefault();

        let answers = this.state.answers.slice().filter((answer, index) => index !== i);

        this.setState({
            answers: answers
        });
    }

    private changeQuestion(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({question: e.target.value});
    }

    render() {
        return (
            <form>
                <div>
                    <span>question</span>
                    <input value={this.state.question} onChange={this.changeQuestion} type="text"/>
                </div>
                <AnswerList
                    answers={this.state.answers}
                    changeAnswerText={(e: React.ChangeEvent<HTMLInputElement>, i: number) => this.changeAnswerText(e, i)}
                    removeAnswer={(e: React.MouseEvent<HTMLButtonElement>, i: number) => this.removeAnswer(e, i)}
                />
                <div>
                    <button onClick={this.addAnswer}>add</button>
                </div>
                <div>
                    <input onClick={this.submitForm} type="submit" value="start"/>
                </div>
            </form>
        )
    }
}

export default withRouter(CreatePollForm);