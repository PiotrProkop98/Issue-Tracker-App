import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAppDispatch } from '../store';

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
    const dispatch = useAppDispatch();
    const { projects, last_page, loaded } = useSelector((state: RootState) => state.projectSlice);

    const [isLoading, setIsloading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<string>('1');
    const [lastPage, setLastPage] = useState<number>(1);

    const [projectsJsx, setProjectsJsx] = useState<any>();
    const [prevButtonJsx, setPrevButtonJsx] = useState<any>();
    const [nextButtonJsx, setNextButtonJsx] = useState<any>();

    useEffect(() => {
        setCurrentPage('1');
    }, []);

    useEffect(() => {
        setLastPage(Number(last_page));

        setIsloading(true);

        dispatch(fetchProjects(Number(currentPage)))
            .unwrap()
            .then(result => {
                setIsloading(false);
            })
            .catch(err => console.error(err));
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage === '1') return;
        setCurrentPage(String(Number(currentPage) - 1));
    };

    const handleNext = () => {
        if (currentPage === String(lastPage)) return;
        setCurrentPage(String(Number(currentPage) + 1));
    };

    useEffect(() => {
        if (isLoading) {
            setProjectsJsx(<CircularProgress sx={{ marginBottom: '20px' }} />);
        } else {
            setProjectsJsx(
                <TableContainer sx={{ minWidth: '350px' }} component={Paper}>
                    <Table size="small" aria-label="public projects">
                        <TableHead>
                            <TableRow>
                                <TableCell>Project name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { projects.map((project: any, i: number) => (
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

        if (currentPage === '1') {
            setPrevButtonJsx(<Button disabled>Prev</Button>);
        } else {
            setPrevButtonJsx(<Button onClick={handlePrev}>Prev</Button>);
        }

        if (currentPage === String(lastPage)) {
            setNextButtonJsx(<Button disabled>Next</Button>);
        } else {
            setNextButtonJsx(<Button onClick={handleNext}>Next</Button>);
        }
    }, [isLoading]);

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
