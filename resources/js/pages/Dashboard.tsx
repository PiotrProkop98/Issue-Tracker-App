import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { setUsername } from '../store/user';
import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Ref {
    contains: any
};

const Dashboard = () => {
    const ref = useRef<Ref>();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { username, token, id } = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
    const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(false);
    const [usernameAlertJsx, setUsernameAlertJsx] = useState<any>(<></>);
    const [newUsername, setNewUsername] = useState<string>('');

    const handleAddNewProjectClick = () => {
        navigate('/add-new-project');
    };

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

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get(`http://localhost:8100/api/user/get-personal-data/${id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const hideUsernameInput = (e: any) => {
            if (showUsernameInput && ref.current && !ref.current.contains(e.target)) {
                setShowUsernameInput(false);
            }
        };

        document.addEventListener('mousedown', hideUsernameInput);

        return () => {
            document.removeEventListener('mousedown', hideUsernameInput);
        }
    }, [showUsernameInput]);

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
            {isLoading && <CircularProgress sx={{ marginBottom: '20px', marginTop: '20px' }} />}
            {(!isLoading) && (
                <Card sx={{ maxWidth: '600px', marginTop: '30px' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            Change your account data here...
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            {!(showUsernameInput) && (<>
                                { username } <Button onClick={() => setShowUsernameInput(!showUsernameInput)}>Change</Button>
                            </>)}
                            {(showUsernameInput && !(isUsernameLoading) && (
                                <Box ref={ref} sx={{ display: 'inline' }}>
                                    <TextField
                                        label="New username"
                                        variant="standard"
                                        size="small"
                                        sx={{
                                            transform: 'translateY(-15px)'
                                        }}
                                        onChange={(e: any) => setNewUsername(e.target.value)}
                                    />
                                    <Button onClick={handleUsernameSubmit}>Submit change</Button>
                                </Box>
                            ))}
                            {isUsernameLoading && (<CircularProgress />)}
                            {usernameAlertJsx}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Dashboard;
