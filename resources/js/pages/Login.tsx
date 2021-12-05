import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../store';
import { login } from '../store/user';
import { setLoggedInLinks } from '../store/links';

import { Box, Container, Typography, Grid, TextField, Button, Alert, LinearProgress, CircularProgress } from '@mui/material';

const Login = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [initialPageLoading, setInitialPageLoading] = useState<boolean>(true);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessageJsx, setErrorMessageJsx] = useState<any>(<></>);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        setIsLoading(true);

        const data = new FormData(e.currentTarget);

        const object = {
            email: data.get('email'),
            password: data.get('password')
        };

        const invalidCredentialHandler = () => {
            setIsLoading(false);

            setIsEmailValid(false);
            setIsPasswordValid(false);

            setErrorMessageJsx(
                <Grid item xs={12}>
                    <Alert severity="error">
                        Invalid credentials!
                    </Alert>
                </Grid>
            );
        };

        axios.get('http://localhost:8100/sanctum/csrf-cookie').then(() => {
            axios.post('http://localhost:8100/api/login', object)
                .then(response => {
                    if (response.status === 200) {
                        const loginData = {
                            id: response.data.id,
                            username: response.data.name,
                            token: response.data.token
                        };

                        dispatch(login(loginData));
                        dispatch(setLoggedInLinks());

                        setIsLoading(false);

                        navigate('/');
                    } else {
                        invalidCredentialHandler();
                    }
                })
                .catch(() => invalidCredentialHandler());
        });
    };

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        if (localStorage.getItem('username') !== null) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (initialPageLoading) {
            setInitialPageLoading(false);
            return;
        }

        setIsEmailValid(false);

        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!re.test(email.toLowerCase())) {
            setIsEmailValid(false);
            return;
        }

        setIsEmailValid(true);
    }, [email]);

    useEffect(() => {
        if (password.length === 0) {
            setIsPasswordValid(false);
        }
        else if (password.length <= 5) {
            setIsPasswordValid(false);
        } else if (password.length >= 255) {
            setIsPasswordValid(false);
        } else {
            setIsPasswordValid(true);
        }
    }, [password]);

    useEffect(() => {
        if (isEmailValid && isPasswordValid) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isEmailValid, isPasswordValid]);

    useEffect(() => {
        if (!isFormValid) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [isFormValid]);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {(!isLoading) && (<>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e)}
                                />
                            </Grid>
                            { errorMessageJsx }
                        </Grid>
                        <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={disabled}
                            >
                            Sign Up
                        </Button>
                    </Box>
                </>)}
                {isLoading && <CircularProgress sx={{ marginBottom: '20px' }} />}
            </Box>
        </Container>
    );
};

export default Login;
