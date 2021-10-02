import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import AllProjects from '../pages/AllProjects';
import YourProjects from '../pages/YourProjects';
import Login from '../pages/Login';
import Navbar from './Navbar';

const App = () => {
    return (
        <div>
            <Router>
                <CssBaseline />
                <Navbar />

                <Box sx={{ marginTop: '100px' }}></Box>

                <Switch>
                    <Route exact path="/" component={AllProjects} />
                    <Route path="/your-projects" component={YourProjects} />
                    <Route path="/login" component={Login} />
                </Switch>
            </Router>
        </div>
    )
}

export default App;
