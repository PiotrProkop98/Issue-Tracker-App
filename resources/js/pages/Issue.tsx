import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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

const Issue = () => {
    const navigate = useNavigate();

    const { issue_id } = useParams<string>();
    
    const { username, id, token} = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [issue, setIssue] = useState<IssueData>();
    const [user, setUser] = useState<any>();
    const [issueJsx, setIssueJsx] = useState<any>();

    const [isUserLeader, setIsUserLeader] = useState<boolean>(false);

    const [error, setError] = useState<any>(<></>);

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/issue/${issue_id}`)
            .then(response => {
                setIssue(response.data);

                if (localStorage.getItem('username') !== null) {
                    axios.get(`/api/project/get-by-issue-id/${issue_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
                        .then(response => {
                            const project_id = response.data.project_id;

                            axios.get(
                                `/api/user/is-project-leader/${project_id}`,
                                { headers: { 'Authorization': `Bearer ${token}` }}
                            ).then(response2 => {
                                if (response2.data.success !== false && response2.data.is_leader) {
                                    setIsUserLeader(true);
                                }
    
                                setIsLoading(false);
                            })
                            .catch(() => {
                                setIsLoading(false);
                            });
                        })
                        .catch(() => setIsLoading(false));
                } else {
                    setIsLoading(false);
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (issue?.user_id !== null) {
            axios.get(`/api/issue/show-user/${issue_id}/${issue?.user_id}`)
                .then(response1 => {
                    setUser(response1.data.user);
                })
                .catch(err => console.error(err));
        }
    }, [issue]);

    useEffect(() => {
        if (isLoading) {
            setIssueJsx(<CircularProgress sx={{ marginBottom: '20px' }} />);
        } else {
            setIssueJsx(
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Issue: { issue?.title }</Typography>

                        <Typography variant="h5" gutterBottom>
                            Assigned to: { (issue?.user_id === null) ? 'Unassigned' : user?.name }
                        </Typography>

                        <Typography variant="body1" gutterBottom>Problem description: { issue?.description }</Typography>
                        <Typography variant="h6" gutterBottom>Status: { issue?.status }</Typography>
                        <Typography variant="h6" gutterBottom>Added: { issue?.created_at }</Typography>
                    </CardContent>
                    {isUserLeader && (issue?.user_id === null) && (
                        <CardActions>
                            <Button onClick={() => navigate(`/issue/assign/${issue_id}`)}>Assign</Button>
                        </CardActions>
                    )}
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
