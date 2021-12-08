import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUsername } from '../store/user';
import { useAppDispatch } from '../store';
import axios from 'axios';

interface Ref {
    contains: any
};

const UsernameInput = () => {
    const ref = useRef<Ref>();

    const dispatch = useAppDispatch();
    const { username, token, id } = useSelector((state: RootState) => state.userSlice);

    const [showUsernameInput, setShowUsernameInput] = useState<boolean>(false);
    const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(false);
    const [usernameAlertJsx, setUsernameAlertJsx] = useState<any>(<></>);
    const [newUsername, setNewUsername] = useState<string>('');

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
    );
};

export default UsernameInput;

