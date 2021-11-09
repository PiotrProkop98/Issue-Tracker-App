import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import store from '../store';

import AllProjects from '../pages/AllProjects';
import Project from '../pages/Project';
import YourProjects from '../pages/YourProjects';
import Login from '../pages/Login';
import Register from '../pages/Register'
import Navbar from './Navbar';
import Footer from './Footer';
import Issue from '../pages/Issue';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <CssBaseline />
                <Navbar />

                <Box sx={{ marginTop: '100px' }}>
                    <Switch>
                        <Route exact path="/" component={AllProjects} />
                        <Route path="/your-projects" component={YourProjects} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/project/:id" children={<Project />} />
                        <Route path="/issue/:id" children={<Issue />} />
                    </Switch>
                </Box>

                <Footer />
            </Router>
        </Provider>
    )
}

export default App;
