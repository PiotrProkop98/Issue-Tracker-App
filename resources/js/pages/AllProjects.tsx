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

import { fetchProjects, setLoaded, setCurrentPage } from '../store/projects';
import { RootState } from '../store';

const AllProjects = () => {
    const dispatch = useAppDispatch();
    const { projects, last_page, loaded, current_page } = useSelector((state: RootState) => state.projectSlice);

    const [isLoading, setIsloading] = useState<boolean>(true);

    const [projectsJsx, setProjectsJsx] = useState<any>();
    const [prevButtonJsx, setPrevButtonJsx] = useState<any>();
    const [nextButtonJsx, setNextButtonJsx] = useState<any>();
    const [pageButtonsJsx, setPageButtonsJsx] = useState<any>();

    useEffect(() => {
        if (loaded) {
            setIsloading(false);
            return;
        }

        setIsloading(true);

        dispatch(fetchProjects(Number(current_page)))
            .unwrap()
            .then(result => {
                setIsloading(false);
            })
            .catch(err => console.error(err));
    }, [current_page]);

    const handlePrev = () => {
        if (current_page === '1') return;
        dispatch(setLoaded(false));
        dispatch(setCurrentPage(String(Number(current_page) - 1)));
    };

    const handleNext = () => {
        if (current_page === last_page) return;
        dispatch(setLoaded(false));
        dispatch(setCurrentPage(String(Number(current_page) + 1)));
    };

    const handleNavButtons = (pageNumber: string) => {
        dispatch(setLoaded(false));
        dispatch(setCurrentPage(pageNumber));
    }

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

        if (current_page === '1') {
            setPrevButtonJsx(<Button disabled>Prev</Button>);
        } else {
            setPrevButtonJsx(<Button onClick={handlePrev}>Prev</Button>);
        }

        if (current_page === String(last_page)) {
            setNextButtonJsx(<Button disabled>Next</Button>);
        } else {
            setNextButtonJsx(<Button onClick={handleNext}>Next</Button>);
        }

        let buttonsJsx: any[];

        if (last_page === '1') {
            buttonsJsx = [];
        } else if (last_page === '2') {
            buttonsJsx = [
                <Button key={1} onClick={() => handleNavButtons('1')}>1</Button>,
                <Button key={2} onClick={() => handleNavButtons('2')}>2</Button>
            ];
        } else if (last_page === '3') {
            buttonsJsx = [
                <Button key={1} onClick={() => handleNavButtons('1')}>1</Button>,
                <Button key={2} onClick={() => handleNavButtons('2')}>2</Button>,
                <Button key={3} onClick={() => handleNavButtons('3')}>3</Button>
            ]
        } else {
            buttonsJsx = [
                <Button key={1} onClick={() => handleNavButtons('1')}>1</Button>,
                <Button key={2} onClick={() => handleNavButtons('2')}>2</Button>,
                <Button key={3} onClick={() => handleNavButtons('3')}>3</Button>,
                <Button key={4}>...</Button>,
                <Button key={5} onClick={() => handleNavButtons(last_page)}>{ last_page }</Button>
            ]
        }

        setPageButtonsJsx(buttonsJsx);
    }, [isLoading]);

    return (
        <Container maxWidth="xs">
            { projectsJsx }
            { !isLoading &&
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <ButtonGroup variant="contained" aria-label="navigation buttons">
                        { prevButtonJsx }
                        { pageButtonsJsx.map((btn: any) => btn) }
                        { nextButtonJsx }
                    </ButtonGroup>
                    <Typography mt={1} variant="h6" component="div">
                        Page: {current_page}
                    </Typography>
                </Grid>
            }
        </Container>
    );
};

export default AllProjects;
