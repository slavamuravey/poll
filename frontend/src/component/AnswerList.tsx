import React from "react";

type Props = {
    answers: Array<{
        text: string,
    }>,
    changeAnswerText(e: React.ChangeEvent<HTMLInputElement>, index: number): void,
    removeAnswer(e: React.MouseEvent<HTMLButtonElement>, index: number): void,
}

class AnswerList extends React.Component<Props> {
    render() {
        return (
            <div>
                {this.props.answers.map((answer, index) => (
                    <div key={index}>
                        <span>answer</span>
                        <input value={answer.text} type="text" onChange={e => this.props.changeAnswerText(e, index)}/>
                        <button onClick={e => this.props.removeAnswer(e, index)}>rm</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default AnswerList;