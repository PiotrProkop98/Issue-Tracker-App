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
import Issue from '../pages/Issue';
import Navbar from './Navbar';
import Footer from './Footer';
import Dashboard from '../pages/Dashboard';
import AddNewProject from '../pages/AddNewProject';
import ProjectEdit from '../pages/ProjectEdit';
import AddIssue from '../pages/AddIssue';
import IssueAssign from '../pages/IssueAssign';
import NewIssues from '../pages/NewIssues';
import IssuesInProgress from '../pages/IssuesInProgress';

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
                        <Route path="/project/edit/:project_id" element={<ProjectEdit />} />
                        <Route path="/your-projects" element={<YourProjects />} />
                        <Route path="/project/:project_id" element={<Project />} />
                        <Route path="/issue/:issue_id" element={<Issue />} />
                        <Route path="/issue/create/:project_id" element={<AddIssue />} />
                        <Route path="/issue/assign/:issue_id" element={<IssueAssign />} />
                        <Route path="/new-issues" element={<NewIssues />} />
                        <Route path="/issue-in-progress" element={<IssuesInProgress />} />
                    </Routes>
                </Box>

                <Footer />
            </Router>
        </Provider>
    )
}

export default App;
