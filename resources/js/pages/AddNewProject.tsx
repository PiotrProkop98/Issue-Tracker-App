import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

const AddNewProject = () => {
    const history = useHistory();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [developer_company_name, setDeveloper_company_name] = useState<string>('');
    const [client_company_name, setClient_company_name] = useState<string>('');
    const [is_private, setIs_private] = useState<boolean>(false);

    const [disabled, setDisabled] = useState<boolean>(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const onDeveloper_company_nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeveloper_company_name(e.target.value);
    };

    const onClient_company_nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClient_company_name(e.target.value);
    };

    const onIs_privateChange = () => {
        setIs_private(!is_private);
    };

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            history.push('/');
        }
    }, []);

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Create new project
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Project name"
                                name="name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                id="description"
                                label="Project description"
                                name="description"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDescriptionChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="developer_name"
                                label="Project developer company name"
                                name="developer_name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDeveloper_company_nameChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="client_name"
                                label="Project developer company name"
                                name="client_name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onClient_company_nameChange(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                label="Private project?"
                                control={
                                    <Checkbox
                                        checked={is_private}
                                        onChange={onIs_privateChange}
                                    />
                                }
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
                        Add project
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddNewProject;
