import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';

const AddIssue = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [disabled, setDisabled] = useState<boolean>(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (disabled) {
            return;
        }
    };

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

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
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default AddIssue;
