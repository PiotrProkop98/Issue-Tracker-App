import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Dashboard from '../pages/Dashboard';
import AddNewProject from '../pages/AddNewProject';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <CssBaseline />
                <Navbar />

                <Box sx={{ marginTop: '100px' }}>
                    <Routes>
                        <Route path="/" element={<AllProjects />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/add-new-project" element={<AddNewProject />} />
                        <Route path="/your-projects" element={<YourProjects />} />
                        <Route path="/project/:id" element={<Project />} />
                        <Route path="/issue/:id" element={<Issue />} />
                    </Routes>
                </Box>

                <Footer />
            </Router>
        </Provider>
    )
}

export default App;
