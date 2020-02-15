import {RouteComponentProps, withRouter} from "react-router";
import React from "react";
import {Formik, FormikValues} from "formik";
import {Box, Button, IconButton, TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Add, Delete} from "@material-ui/icons";

class PollCreateForm extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Formik
                initialValues={{
                    question: '',
                    answers: [
                        {
                            text: ''
                        },
                        {
                            text: ''
                        }
                    ],
                }}
                validateOnChange={false}
                validate={(values: FormikValues) => {
                    const errors = [];

                    if (values.answers.length === 0) {
                        errors.push('No answers');
                    }

                    if (values.answers.find((answer: Answer) => answer.text.trim() === '')) {
                        errors.push('There is empty answer in list');
                    }

                    if (values.question.trim() === '') {
                        errors.push('Question are required');
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
                                <Alert key={index} severity="error">{value}</Alert>
                            )) : ''
                        }

                        <form>
                            <Box>
                                <TextField label="Question" value={values.question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setValues({
                                        ...values,
                                        question: e.target.value
                                    });
                                }}/>
                            </Box>

                            <Box>
                                {values.answers.map((answer: Answer, index: number) => (
                                    <div key={index}>
                                        <TextField label="Answer" value={answer.text}
                                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                   let answers: Array<Answer> = values.answers.slice();
                                                   let answer: Answer = answers[index];
                                                   answer.text = e.target.value;

                                                   setValues({
                                                       ...values,
                                                       answers: answers
                                                   });
                                               }}/>
                                        <IconButton
                                            color="secondary"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.preventDefault();

                                                let answers = values.answers.slice().filter((answer: Answer, i: number) => index !== i);

                                                setValues({
                                                    ...values,
                                                    answers: answers
                                                });
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </div>
                                ))}
                            </Box>
                            <div>
                                <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();

                                    setValues({
                                        ...values,
                                        answers: values.answers.concat({
                                            text: ''
                                        })
                                    });
                                }}>
                                    <Add />
                                </IconButton>
                            </div>
                            <div>
                                <Button variant="contained" color="primary" onClick={() => !isSubmitting ? submitForm() : false}>
                                    Start
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </Formik>
        )
    }
}

export default withRouter(PollCreateForm);