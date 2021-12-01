import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button, Card, CardActions, CardContent, Container, Typography } from '@mui/material';

const Dashboard = () => {
    const history = useHistory();
    const { username } = useSelector((state: RootState) => state.userSlice);

    const handleAddNewProjectClick = () => {
        history.push('/add-new-project');
    };

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            history.push('/');
        }
    }, []);

    return (
        <Container maxWidth="md" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Card sx={{ maxWidth: '600px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Welcome, { username }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This is your dashboard. Here you can add new projects, or change your personal data.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={handleAddNewProjectClick}>Add new project!</Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default Dashboard;
