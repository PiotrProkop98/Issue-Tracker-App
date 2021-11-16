import { Box, Card, CardContent, CircularProgress, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ParamTypes {
    id: string
};

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
    const { id } = useParams<ParamTypes>();
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [issue, setIssue] = useState<IssueData>();
    const [user, setUser] = useState<any>();
    const [issueJsx, setIssueJsx] = useState<any>();

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/issue/${id}`)
            .then(response => {
                setIssue(response.data);

                if (issue?.user_id !== null && issue?.user_id !== undefined) {
                    axios.get(`/api/issue/show-user/${id}/${issue?.user_id}`)
                        .then(response1 => {
                            setUser(response1.data);
                            setIsLoading(false);
                        })
                        .catch(err => console.error(err));
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
                { issueJsx }
            </Box>
        </Container>
    );
};

export default Issue;
