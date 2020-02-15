import {RouteComponentProps} from "react-router";
import React from "react";
import PollCreateForm from "../component/PollCreateForm";

class PollCreate extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <PollCreateForm />
        )
    }
}

export default PollCreate;