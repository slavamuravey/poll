import React from 'react';
import './App.scss'
import {Route, BrowserRouter, Switch, Link} from 'react-router-dom'
import CreatePollForm from "./CreatePollForm";
import PollPage from "./PollPage";
import NoMatch from "./NoMatch";

class App extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/poll/x">poll x</Link></li>
                    </ul>

                    <div>
                        <Switch>
                            <Route exact path="/">
                                <CreatePollForm />
                            </Route>
                            <Route path="/poll/:pollId" component={PollPage} />
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;
