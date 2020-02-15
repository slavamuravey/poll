import {RouteComponentProps, withRouter} from "react-router";
import React from "react";
import {Formik, FormikValues} from "formik";

class PollCreateForm extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Formik
                initialValues={{
                    question: '',
                    answers: [],
                }}
                validateOnChange={false}
                validate={(values: FormikValues) => {
                    const errors = [];

                    if (values.answers.length === 0) {
                        errors.push('no answers');
                    }

                    if (values.answers.find((answer: Answer) => answer.text.trim() === '')) {
                        errors.push('has empty answers');
                    }

                    if (values.question.trim() === '') {
                        errors.push('empty question');
                    }

                    return errors;
                }}
                onSubmit={(values: FormikValues, {setSubmitting}) => {
                    setSubmitting(true);

                    fetch('http://localhost:8080/poll', {
                        method: 'POST',
                        body: JSON.stringify({
                            question: values.question,
                            possibleAnswers: values.answers,
                            answers: []
                        })
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            setSubmitting(false);
                            this.props.history.push(`/poll/${res.data.id}`);
                        });
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
                                <span>question</span>
                                <input value={values.question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setValues({
                                        ...values,
                                        question: e.target.value
                                    });
                                }} type="text"/>
                            </div>
                            <div>
                                {values.answers.map((answer: Answer, index: number) => (
                                    <div key={index}>
                                        <span>answer</span>
                                        <input value={answer.text} type="text"
                                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                   let answers: Array<Answer> = values.answers.slice();
                                                   let answer: Answer = answers[index];
                                                   answer.text = e.target.value;

                                                   setValues({
                                                       ...values,
                                                       answers: answers
                                                   });
                                               }}/>
                                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault();

                                            let answers = values.answers.slice().filter((answer: Answer, i: number) => index !== i);

                                            setValues({
                                                ...values,
                                                answers: answers
                                            });
                                        }}>rm
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();

                                    setValues({
                                        ...values,
                                        answers: values.answers.concat({
                                            text: ''
                                        })
                                    });
                                }}>add
                                </button>
                            </div>
                            <div>
                                <input onClick={() => !isSubmitting ? submitForm() : false} type="button"
                                       value="start"/>
                            </div>
                        </form>
                    </>
                )}
            </Formik>
        )
    }
}

export default withRouter(PollCreateForm);