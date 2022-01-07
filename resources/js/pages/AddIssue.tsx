import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import axios from 'axios';
import { Box, Container, Grid, Typography, TextField, Button, responsiveFontSizes, Alert, CircularProgress } from '@mui/material';

const AddIssue = () => {
    const navigate = useNavigate();

    const { project_id } = useParams<string>();

    const { token} = useSelector((state: RootState) => state.userSlice);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [disabled, setDisabled] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<any>(<></>);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (disabled) {
            return;
        }

        setIsLoading(true);

        const data = {
            title: title,
            description: description,
            status: 'New',
            project_id: project_id
        };

        axios.post('http://localhost:8100/api/issue/create', data, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);

                if (response.data.success != true) {
                    setError(<Alert severity="error">Invalid issue data!</Alert>);
                } else {
                    navigate(`/issue/${response.data.id}`);
                }
            })
            .catch(() => {
                setIsLoading(false);
                setError(<Alert severity="error">Invalid issue data!</Alert>);
            });
    };

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (title.length < 3 || title.length > 254) {
            setDisabled(true);
            return;
        }

        if (description.length == 0 || description.length > 254) {
            setDisabled(true);
            return;
        }

        setDisabled(false);
    }, [title, description]);

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
                {isLoading && <CircularProgress />}
                {!(isLoading) && (<>
                    <Typography component="h1" variant="h5">
                        Add issue
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="title"
                                    label="Name your issue"
                                    name="title"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTitleChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    id="description"
                                    label="Describe your issue here"
                                    name="description"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDescriptionChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={disabled}
                                >
                                    Add issue
                                </Button>
                            </Grid>
                            <Grid item xs={12}>{error}</Grid>
                        </Grid>
                    </Box>
                </>)}
            </Box>
        </Container>
    );
};

export default AddIssue;
