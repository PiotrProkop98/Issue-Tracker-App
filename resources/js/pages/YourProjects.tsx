import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

interface Project {
    id: number
    name: string,
    description: string,
    developer_company_name: string,
    client_company_name: string,
    is_private: boolean
};

const YourProjects = () => {
    const navigate = useNavigate();

    const { token } = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [yourProjects, setYourProjects] = useState<Project[]>([]);

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get('/api/projects/projects-user-belongs-to-only', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);
                setYourProjects(response.data.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <Container maxWidth="md">
            {isLoading && <CircularProgress />}
            {!(isLoading) && <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {yourProjects.map((project: Project, i: number) => (
                            <Card key={i} sx={{ marginBottom: '25px' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{ project.name }</Typography>
                                    <Typography variant="subtitle2" gutterBottom>{ project.description }</Typography>
                                    <Grid container spacing={1} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption">Client: { project.client_company_name }</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption">Develop By: { project.developer_company_name }</Typography>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ marginTop: '25px' }}
                                        onClick={() => navigate(`/project/${project.id}`)}
                                    >
                                        See More
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            </>}
        </Container>
    );
};

export default YourProjects;
