import React from 'react';
import './App.scss'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import PageNotFound from "./page/PageNotFound";
import PollCreate from "./page/PollCreate";
import PollOverview from "./page/PollOverview";

class App extends React.Component<{}, {}> {
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
                            <Route exact path="/" component={PollCreate} />
                            <Route path="/poll/:pollId" component={PollOverview} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;
