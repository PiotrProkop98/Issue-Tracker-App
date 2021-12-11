import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { RootState, useAppDispatch } from '../store';
import { fetchProjectEditData, setIsLoading } from '../store/projectEdit';
import axios from 'axios';

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
                    dispatch(fetchProjectEditData({ id: Number(id), token: token })).unwrap();
                } else {
                    handleReponseError();
                }
            })
            .catch(() => handleReponseError());
    }, []);

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
                    {isLoading && <CircularProgress />}
                    {!(isLoading) && (<>
                        <Typography component="h1" variant="h5">
                            Log in
                        </Typography>
                        <Grid container spacing={2}>

                        </Grid>
                    </>)}
                </Box>
            </Container>
        </>
    );
};

export default ProjectEdit;
