import React from 'react'
import {Formik, FormikValues} from "formik";

type Props = {
    pollId: string,
    question: string,
    possibleAnswers: Array<Answer>,
    ws: SocketIOClient.Socket,
}

class AddRespondentAnswerForm extends React.Component<Props, {}> {
    render() {
        return (
            <Formik
                initialValues={{
                    respondentName: '',
                    respondentAnswerIndex: undefined,
                }}
                validateOnChange={false}
                validate={(values: FormikValues) => {
                    const errors = [];

                    if (values.respondentName.trim() === '') {
                        errors.push('empty respondent name');
                    }

                    if (undefined === values.respondentAnswerIndex) {
                        errors.push('empty answer');
                    }

                    return errors;
                }}
                onSubmit={(values: FormikValues, {setSubmitting}) => {
                    setSubmitting(true);

                    this.props.ws.emit('message', {
                        answer: {
                            answerIndex: values.respondentAnswerIndex,
                            respondentName: values.respondentName
                        },
                        room: this.props.pollId
                    });

                    setSubmitting(false);
                }}
            >
                {({isSubmitting, values, setValues, submitForm, errors, isValid}) => (
                    <>
                        {
                            !isValid && Array.isArray(errors) ? errors.map((value, index) => (
                                <div key={index}>
                                    {value}
                                </div>
                            )) : ''
                        }

                        <form>
                            <div>
                                <span>question: </span>
                                <span>{this.props.question}</span>
                            </div>
                            <div>
                                <span>your name: </span>
                                <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setValues({
                                        ...values,
                                        respondentName: e.target.value
                                    });
                                }} value={values.respondentName}/>
                            </div>
                            <div>
                                {this.props.possibleAnswers.map((value: Answer, index) => (
                                    <span key={index}>
                                        <input
                                            type="radio"
                                            value={index}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setValues({
                                                    ...values,
                                                    respondentAnswerIndex: +e.target.value
                                                });
                                            }}
                                            checked={values.respondentAnswerIndex === index}
                                        />
                                        {value.text}
                                    </span>
                                ))}
                            </div>
                            <div>
                                <input type="button" value="submit"
                                       onClick={() => !isSubmitting ? submitForm() : false}/>
                            </div>
                        </form>
                    </>
                )}
            </Formik>
        );
    }
}

export default AddRespondentAnswerForm;