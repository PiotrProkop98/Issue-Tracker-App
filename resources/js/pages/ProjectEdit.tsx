import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Box, Button, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { RootState, useAppDispatch } from '../store';
import axios from 'axios';
import {
    fetchProjectEditData,
    setClientCompanyName,
    setDescription,
    setDeveloperCompanyName,
    setIsLoading,
    setIsPrivate,
    setName
} from '../store/projectEdit';

const ProjectEdit = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { project_id } = useParams<string>();

    const { token, id } = useSelector((state: RootState) => state.userSlice);
    const {
        isLoading,
        name,
        description,
        developer_company_name,
        client_company_name,
        is_private
    } = useSelector((state: RootState) => state.projectEditSlice);

    const [isUserAllowed, setIsUserAllowed] = useState<boolean>(false);

    const [disabled, setDisabled] = useState<boolean>(false);

    const [responseAlertJsx, setResponseAlertJsx] = useState<any>(<></>);

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        const handleReponseError = () => {
            dispatch(setIsLoading(false));
            setIsUserAllowed(false);
        };

        dispatch(setIsLoading(true));

        axios.get(`/api/projects/view-private/${id}/${project_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                if (response.data.success == true) {
                    setIsUserAllowed(true);
                    dispatch(fetchProjectEditData({ id: Number(project_id), token: token })).unwrap();
                } else {
                    handleReponseError();
                }
            })
            .catch(() => handleReponseError());
    }, []);

    useEffect(() => {
        if (
            name.length == 0 ||
            description.length == 0 ||
            developer_company_name.length == 0 ||
            client_company_name.length == 0
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [name, description, developer_company_name, client_company_name]);

    const handleSubmit = () => {
        if (disabled) return;

        const data = {
            name: name,
            description: description,
            developer_company_name: developer_company_name,
            client_company_name: client_company_name,
            is_private: is_private
        };

        const handleError = () => {
            dispatch(setIsLoading(false));

            setResponseAlertJsx(
                <Alert severity="error">Invalid data!</Alert>
            );
        };

        dispatch(setIsLoading(true));

        axios.post(
            `http://localhost:8100/api/projects/edit/${id}/${project_id}`,
            data,
            { headers: { 'Authorization': `Bearer ${token}` }}
        ).then(response => {
            dispatch(setIsLoading(false));

            setResponseAlertJsx(
                <Alert severity="success">Successfully changed project data!</Alert>
            );
        }).catch(() => {
            handleError();
        });
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleDelete = () => {
        setIsDeleteLoading(true);

        axios.delete(`/api/project/${id}/${project_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(() => {
                setIsDeleteLoading(false);
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            {!(isUserAllowed) && !(isLoading) && (
                <Container component="main" maxWidth="sm">
                    <Typography variant="h5">Sorry, only Project Leader is allowed to edit project data!</Typography>
                </Container>
            )}
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                <Dialog
                    open={alertOpen}
                    onClose={handleAlertClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {!(isDeleteLoading) && (<>
                        <DialogTitle id="alert-dialog-title">
                            Are you SURE you want to deleta this project?
                        </DialogTitle>
                        <DialogActions>
                            <Button autoFocus onClick={handleAlertClose}>NO</Button>
                            <Button color="error" onClick={handleDelete}>YES</Button>
                        </DialogActions>
                    </>)}
                    {isDeleteLoading && (<>
                        <DialogContent>
                            <CircularProgress />
                        </DialogContent>
                    </>)}
                </Dialog>
                    {isLoading && <CircularProgress />}
                    {!(isLoading) && isUserAllowed && (<>
                        <Typography component="h1" variant="h5">
                            Edit project data <Button onClick={() => setAlertOpen(true)}><DeleteIcon sx={{ color: red[500] }} /></Button>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Project name"
                                    name="name"
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setName(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Project description"
                                    name="description"
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDescription(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Project developer company name"
                                    name="developer_name"
                                    value={developer_company_name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setDeveloperCompanyName(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Project developer company name"
                                    name="client_name"
                                    value={client_company_name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setClientCompanyName(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    label="Private project?"
                                    control={
                                        <Checkbox
                                            checked={Boolean(is_private)}
                                            onChange={()  => dispatch(setIsPrivate(!is_private))}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={disabled}
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            Submit changes
                        </Button>
                        {responseAlertJsx}
                    </>)}
                </Box>
            </Container>
        </>
    );
};

export default ProjectEdit;
