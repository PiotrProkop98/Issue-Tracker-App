import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Box, Container, Typography, Grid, TextField, Button, Alert, LinearProgress } from '@mui/material';

const Login = () => {
    const [initialPageLoading, setInitialPageLoading] = useState<boolean>(true);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [emailMessageJsx, setEmailMessageJsx] = useState<any>(<></>);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordMessageJsx, setPasswordMessageJsx] = useState<any>(<></>);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [typing, setTyping] = useState<any>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        console.log(data.get('email'), data.get('password'));
    };

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        if (initialPageLoading) {
            setInitialPageLoading(false);
            return;
        }

        setIsEmailValid(false);

        setEmailMessageJsx(
            <Grid item xs={12}>
                <Typography>Checking email...</Typography>
                <LinearProgress />
            </Grid>
        );

        clearTimeout(typing);

        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!re.test(email.toLowerCase())) {
            setIsEmailValid(false);

            setEmailMessageJsx(
                <Grid item xs={12}>
                    <Alert severity="error">Email invalid!</Alert>
                </Grid>
            );

            return;
        }

        setTyping(setTimeout(() => {
            axios.post('http://localhost:8100/api/user/is-email-taken', { email: email })
                .then(response => {
                    setIsEmailValid(!response.data['taken']);

                    if (response.data['taken']) {
                        setEmailMessageJsx(
                            <Grid item xs={12}>
                                <Alert severity="error">Email already taken!</Alert>
                            </Grid>
                        );
                    } else {
                        setEmailMessageJsx(
                            <Grid item xs={12}>
                                <Alert severity="success">Email valid!</Alert>
                            </Grid>
                        );
                    }
                })
                .catch(err => console.error(err));
        }, 1000));
    }, [email]);

    useEffect(() => {
        if (password.length === 0) {
            setIsPasswordValid(false);
            setPasswordMessageJsx(<></>);
        }
        else if (password.length <= 5) {
            setIsPasswordValid(false);
            setPasswordMessageJsx(
                <Grid item xs={12}>
                    <Alert severity="error">Password too short!</Alert>
                </Grid>
            );
        } else if (password.length >= 255) {
            setIsPasswordValid(false);
            setPasswordMessageJsx(
                <Grid item xs={12}>
                    <Alert severity="error">Password too long!</Alert>
                </Grid>
            );
        } else {
            setIsPasswordValid(true);
            setPasswordMessageJsx(
                <Grid item xs={12}>
                    <Alert severity="success">Password valid!</Alert>
                </Grid>
            );
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
                    alignItems: 'center',
                }}
            >
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
                        { emailMessageJsx }
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
                        { passwordMessageJsx }
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
            </Box>
        </Container>
    );
};

export default Login;
