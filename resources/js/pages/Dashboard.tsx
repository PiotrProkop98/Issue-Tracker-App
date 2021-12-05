import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button, Card, CardActions, CardContent, CircularProgress, Container, Typography } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const { username, token, id } = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAddNewProjectClick = () => {
        navigate('/add-new-project');
    };

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get(`http://localhost:8100/api/user/get-personal-data/${id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);
                console.log(response);
            })
            .catch(err => console.error(err));
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
            {isLoading && <CircularProgress sx={{ marginBottom: '20px' }} />}
            {(!isLoading) && (
                <Card sx={{ maxWidth: '600px', marginTop: '30px' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            Change your account data here...
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            { username } <Button>Change</Button>
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Dashboard;
