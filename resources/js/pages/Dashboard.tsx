import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { setUsername, setEmail } from '../store/user';
import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Input from '../components/Input';

const Dashboard = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { username, token, id } = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(false);
    const [usernameAlertJsx, setUsernameAlertJsx] = useState<any>(<></>);
    const [newUsername, setNewUsername] = useState<string>('');

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get(`http://localhost:8100/api/user/get-personal-data/${id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                dispatch(setEmail(response.data.email));
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleUsernameSubmit = () => {
        const handleResponseSuccess = () => {
            dispatch(setUsername({username: newUsername}));

            setUsernameAlertJsx(<Alert severity="success">Username changed!</Alert>);

            setIsUsernameLoading(false);

            setTimeout(() => {
                setUsernameAlertJsx(<></>);
            }, 3000);
        };

        const handleResponseError = () => {
            setUsernameAlertJsx(<Alert severity="error">Invalid username!</Alert>);
            
            setIsUsernameLoading(false);

            setTimeout(() => {
                setUsernameAlertJsx(<></>);
            }, 3000);
        };

        setIsUsernameLoading(true);

        axios.post('http://localhost:8100/api/user/change-name', { name: newUsername, id: id }, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                handleResponseSuccess();
            })
            .catch(() => handleResponseError());
    };

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
                    <Button onClick={() => navigate('/add-new-project')}>Add new project!</Button>
                </CardActions>
            </Card>
            {isLoading && <CircularProgress sx={{ marginBottom: '20px', marginTop: '20px' }} />}
            {(!isLoading) && (
                <Card sx={{ maxWidth: '600px', marginTop: '30px' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            Change your account data here...
                        </Typography>
                        
                        <Input
                            inputText={username}
                            isInputLoading={isUsernameLoading}
                            inputAlertJsx={usernameAlertJsx}
                            setNewInput={setNewUsername}
                            handleInputSubmit={handleUsernameSubmit}
                        />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Dashboard;
