import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Button, 
    ButtonGroup, 
    CircularProgress, 
    Container, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Typography
} from '@mui/material';

import { fetchProjects } from '../store/projects';
import { RootState } from '../store';

const AllProjects = () => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state: RootState) => state.projectSlice);

    const [isLoading, setIsloading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<string>('1');
    const [lastPage, setLastPage] = useState<string>('1');

    useEffect(() => {
        setCurrentPage('1');
        setIsloading(true);

        const fetch = async () => {
            dispatch(fetchProjects(currentPage));

            setIsloading(false);
            setLastPage(String(projects.last_page));
        };

        fetch();
    }, [dispatch]);

    const handlePrev = () => {
        if (currentPage === '1') return;

        setCurrentPage(String(Number(currentPage) - 1));
        setIsloading(true);

        const fetch = async () => {
            await dispatch(fetchProjects(currentPage));
            setIsloading(false);
        };

        fetch();
    };

    const handleNext = () => {
        if (currentPage === lastPage) return;

        setCurrentPage(String(Number(currentPage) + 1));
        setIsloading(true);

        const fetch = async () => {
            await dispatch(fetchProjects(currentPage));
            setIsloading(false);
        };

        fetch();
    };

    let projectsJsx;

    if (isLoading) {
        projectsJsx = <CircularProgress sx={{ marginBottom: '20px' }} />;
    } else {
        projectsJsx = (
            <TableContainer sx={{ minWidth: '350px' }} component={Paper}>
                <Table size="small" aria-label="public projects">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { projects!.data.map((project: any, i: number) => (
                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    { project.name }
                                </TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    let prevButtonJsx;
    let nextButtonJsx;

    if (currentPage === '1') {
        prevButtonJsx = <Button disabled>Prev</Button>;
    } else {
        prevButtonJsx = <Button onClick={handlePrev}>Prev</Button>;
    }

    if (currentPage === lastPage) {
        nextButtonJsx = <Button disabled>Next</Button>;
    } else {
        nextButtonJsx = <Button onClick={handleNext}>Next</Button>;
    }

    return (
        <Container maxWidth="xs">
            { projectsJsx }
            { !isLoading &&
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <ButtonGroup variant="contained" aria-label="navigation buttons">
                        { prevButtonJsx }
                        { nextButtonJsx }
                    </ButtonGroup>
                    <Typography mt={1} variant="h6" component="div">
                        Page: {currentPage}
                    </Typography>
                </Grid>
            }
        </Container>
    );
};

export default AllProjects;
