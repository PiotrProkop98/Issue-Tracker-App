import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AllProjects from '../pages/AllProjects';
import YourProjects from '../pages/YourProjects';
import Navbar from './Navbar';

const App = () => {
    return (
        <div>
            <Router>
                <Navbar />

                <Switch>
                    <Route exact path="/" component={AllProjects} />
                    <Route path="/your-projects" component={YourProjects} />
                </Switch>
            </Router>
        </div>
    )
}

export default App;
