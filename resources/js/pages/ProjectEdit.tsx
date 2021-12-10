import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container } from '@mui/material';
import { RootState, useAppDispatch } from '../store';
import { fetchProjectEditData } from '../store/projectEdit';

const ProjectEdit = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { id } = useParams<string>();

    const { token } = useSelector((state: RootState) => state.userSlice);
    const {
        isLoading,
        name,
        description,
        developer_company_name,
        client_company_name,
        is_private
    } = useSelector((state: RootState) => state.projectEditSlice);

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        dispatch(fetchProjectEditData({ id: Number(id), token: token })).unwrap();
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
                {isLoading && <CircularProgress />}
            </Box>
        </Container>
    );
};

export default ProjectEdit;
