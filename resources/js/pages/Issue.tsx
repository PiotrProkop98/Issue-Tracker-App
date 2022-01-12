import { Alert, Box, Card, CardContent, CircularProgress, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../store';

interface IssueData {
    id: number,
    project_id: number,
    user_id: number|null
    title: string,
    description: string,
    status: string,
    created_at: string,
    updated_at: string
};

interface Member {
    name: string
};

const Issue = () => {
    const { issue_id } = useParams<string>();

    const { username, id, token} = useSelector((state: RootState) => state.userSlice);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [issue, setIssue] = useState<IssueData>();
    const [user, setUser] = useState<any>();
    const [issueJsx, setIssueJsx] = useState<any>();

    const [members, setMembers] = useState<Member[]>([]);

    const [error, setError] = useState<any>(<></>);

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/issue/${issue_id}`)
            .then(response => {
                setIssue(response.data);

                if (issue?.user_id !== null && issue?.user_id !== undefined) {
                    axios.get(`/api/issue/show-user/${issue_id}/${issue?.user_id}`)
                        .then(response1 => {
                            setUser(response1.data);
                        })
                        .catch(err => console.error(err));
                }

                if (localStorage.getItem('username') !== null) {
                    axios.get(`/api/project/get-by-issue-id/${issue_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
                        .then(response2 => {
                            const project_id = response2.data.project_id;

                            axios.get(`/api/project/${id}/${project_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
                                .then(response2 => {
                                    if (response2.data.allowed == true) {
                                        axios.get(
                                            `/api/user/get-project-members/${project_id}`,
                                            { headers: { 'Authorization': `Bearer ${token}` }}
                                        ).then(response3 => {
                                            setMembers(response3.data.users);
                                            setIsLoading(false);
                                        })
                                    }
                                })
                                .catch(() => {
                                    setIsLoading(false);
                                });
                        })
                        .catch(() => {
                            setIsLoading(false);
                        });
                } else {
                    setIsLoading(false);
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (isLoading) {
            setIssueJsx(<CircularProgress sx={{ marginBottom: '20px' }} />);
        } else {
            setIssueJsx(
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Issue: { issue?.title }</Typography>
                        <Typography variant="h5" gutterBottom>Assign to: { (issue?.user_id === null) ? 'Unassigned' : user?.name }</Typography>
                        <Typography variant="body1" gutterBottom>Problem description: { issue?.description }</Typography>
                        <Typography variant="h6" gutterBottom>Status: { issue?.status }</Typography>
                        <Typography variant="h6" gutterBottom>Added: { issue?.created_at }</Typography>
                    </CardContent>
                </Card>
            );
        }
    }, [isLoading]);

    return (
        <Container maxWidth="md">
            <Box>
                {error}
                { issueJsx }
            </Box>
        </Container>
    );
};

export default Issue;
