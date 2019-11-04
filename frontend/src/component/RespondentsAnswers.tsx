import React from 'react'

type Props = {
    results: Array<RespondentAnswer>,
    possibleAnswers: Array<Answer>,
}

class RespondentsAnswers extends React.Component<Props> {
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>name</th>
                        {this.props.possibleAnswers.map((value: Answer, index) => (
                            <th key={index}>{value.text}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.results.map((value: RespondentAnswer, index) => (
                        <tr key={index}>
                            <td>{value.respondentName}</td>
                            {this.props.possibleAnswers.map((userValue, userIndex) => (
                                <td key={userIndex}>
                                    {value.answerIndex === userIndex ? 'X': ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RespondentsAnswers;