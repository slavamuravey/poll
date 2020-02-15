import React from 'react';
import './App.scss'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import PageNotFound from "./page/PageNotFound";
import PollCreate from "./page/PollCreate";
import PollOverview from "./page/PollOverview";
import {Box, Container, CssBaseline} from "@material-ui/core";

class App extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <CssBaseline />
                <Container>
                    <BrowserRouter>
                        <Box>
                            <Switch>
                                <Route exact path="/" component={PollCreate} />
                                <Route path="/poll/:pollId" component={PollOverview} />
                                <Route component={PageNotFound} />
                            </Switch>
                        </Box>
                    </BrowserRouter>
                </Container>
            </>
        )
    }
}

export default App;
