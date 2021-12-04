import { Alert, Box, Button, CircularProgress, Container, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { login } from '../store/user';
import { setLoggedInLinks } from '../store/links';

const Register = () => {
    const dispatch = useAppDispatch();

    const history = useHistory();

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [isNameValid, setIsNameValid] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

    const [errorNameValidJsx, setErrorNameValidJsx] = useState<any>(<></>);
    const [errorEmailValidJsx, setErrorEmailValidJsx] = useState<any>(<></>);
    const [errorPasswordValidJsx, setErrorPasswordValidJsx] = useState<any>(<></>);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        setIsLoading(true);

        const data = new FormData(e.currentTarget);

        const object = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation')
        };

        const invalidCredentialHandler = () => {
            setIsLoading(false);

            setIsNameValid(false);
            setIsEmailValid(false);
            setIsPasswordValid(false);

            setErrorNameValidJsx(<></>);
            setErrorEmailValidJsx(<></>);

            setErrorPasswordValidJsx(
                <Alert severity="error">
                    Invalid credentials!
                </Alert>
            );
        };

        axios.get('http://localhost:8100/sanctum/csrf-cookie').then(() => {
            axios.post('http://localhost:8100/api/register', object)
                .then(response => {
                    if (response.status === 201) {
                        const loginData = {
                            id: response.data.id,
                            username: response.data.name,
                            token: response.data.token
                        };

                        dispatch(login(loginData));
                        dispatch(setLoggedInLinks());
                        
                        setIsLoading(false);

                        history.push('/');
                    } else {
                        invalidCredentialHandler();
                    }
                })
                .catch(() => invalidCredentialHandler());
        });
    };


    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onPasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmation(e.target.value);
    };

    useEffect(() => {
        if (localStorage.getItem('username') !== null) {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        if (name.length == 0) {
            setIsNameValid(false);
            return;
        }

        if (name.length <= 3) {
            setIsNameValid(false);

            setErrorNameValidJsx(
                <Alert severity="error">
                    Username too short!
                </Alert>
            );
        } else if (name.length >= 255) {
            setIsNameValid(false);

            setErrorNameValidJsx(
                <Alert severity="error">
                    Username too long!
                </Alert>
            );
        } else {
            setIsNameValid(true);
        }
    }, [name]);

    useEffect(() => {
        if (email.length == 0) {
            setIsEmailValid(false);
            return;
        }

        setIsEmailValid(false);

        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!re.test(email.toLowerCase())) {
            setIsEmailValid(false);

            setErrorEmailValidJsx(
                <Alert severity="error">
                    Email invalid!
                </Alert>
            );

            return;
        }

        setTimeout(() => {
            setErrorEmailValidJsx(
                <>
                    <Typography>Checking email...</Typography>
                    <LinearProgress />
                </>
            );

            const invalidCredentialHandler = () => {
                setIsEmailValid(false);

                setErrorEmailValidJsx(
                    <Alert severity="error">
                        Email already taken!
                    </Alert>
                )
            };

            axios.post('http://localhost:8100/api/user/is-email-taken', { email: email })
                .then(response => {
                    if (!response.data.taken) {
                        setIsEmailValid(true);
                    } else {
                        invalidCredentialHandler();
                    }
                })
                .catch(() => invalidCredentialHandler());
        }, 500);
    }, [email]);

    useEffect(() => {
        if (password.length == 0 || passwordConfirmation.length == 0) {
            setIsPasswordValid(false);
            return;
        }

        if (password !== passwordConfirmation) {
            setIsPasswordValid(false);

            setErrorPasswordValidJsx(
                <Alert severity="error">
                    Passwords does not match!
                </Alert>
            );

            return;
        }

        if (password.length < 6) {
            setIsPasswordValid(false);

            setErrorPasswordValidJsx(
                <Alert severity="error">
                    Password too short!
                </Alert>
            );

            return;
        }

        if (password.length > 255) {
            setIsPasswordValid(false);

            setErrorPasswordValidJsx(
                <Alert severity="error">
                    Password too long!
                </Alert>
            );

            return;
        }

        setIsPasswordValid(true);
    }, [password, passwordConfirmation])

    useEffect(() => {
        if (isNameValid && isEmailValid && isPasswordValid) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isNameValid, isEmailValid, isPasswordValid]);

    useEffect(() => {
        if (!isFormValid) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [isFormValid]);

    return (
        <>
            {!(isLoading) && (
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
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e)}
                                    />
                                </Grid>
                                {!(isNameValid) &&
                                    <Grid item xs={12}>
                                        { errorNameValidJsx }
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e)}
                                    />
                                </Grid>
                                {!(isEmailValid) &&
                                    <Grid item xs={12}>
                                        { errorEmailValidJsx }
                                    </Grid>
                                }
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
                                {!(isPasswordValid) &&
                                    <Grid item xs={12}>
                                        { errorPasswordValidJsx }
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password_confirmation"
                                        label="Confirm password"
                                        type="password"
                                        id="password-confirmation"
                                        autoComplete="new-password"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordConfirmationChange(e)}
                                    />
                                </Grid>
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
                    <Typography variant="body2" align="center" sx={{ marginTop: "15px" }}>
                        <Link to="/login" className="link-colored">
                            Already have an account? Sign in
                        </Link>
                    </Typography>
                </Container>
            )}
            { isLoading && (
                <Container component="main" maxWidth="xs">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <CircularProgress sx={{ marginBottom: '20px' }} />
                    </Box>
                </Container>
            )}
    </>);
};

export default Register;
