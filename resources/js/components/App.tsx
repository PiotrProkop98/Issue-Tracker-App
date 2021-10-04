import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import AllProjects from '../pages/AllProjects';
import YourProjects from '../pages/YourProjects';
import Login from '../pages/Login';
import Register from '../pages/Register'
import Navbar from './Navbar';

const App = () => {
    return (
        <div>
            <Router>
                <CssBaseline />
                <Navbar />

                <Box sx={{ marginTop: '100px' }}>
                    <Switch>
                        <Route exact path="/" component={AllProjects} />
                        <Route path="/your-projects" component={YourProjects} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                    </Switch>
                </Box>
            </Router>
        </div>
    )
}

export default App;
