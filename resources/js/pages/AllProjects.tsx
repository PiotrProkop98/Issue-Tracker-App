import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

interface ProjectsState {
    data: [
        {
            created_at: string,
            updated_at: string,
            id: number,
            is_private: number,
            name: string
        }
    ]
};

const AllProjects = () => {
    const [projects, setProjects] = useState<ProjectsState>();
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [nextPageUrl, setNextPageUrl] = useState<string>('');
    const [prevPageUrl, setPrevPageUrl] = useState<string>('');
    const [firstPageUrl, setFirstPageUrl] = useState<string>('');
    const [lastPageUrl, setLastPageUrl] = useState<string>('');

    const base_url = 'http://localhost:8100/api/projects';

    useEffect(() => {
        setIsloading(true);

        const source = axios.CancelToken.source();
        let mounted = true;

        const fetchProjects = async () => {
            try {
                const response = await axios.get(base_url);

                if (!mounted) return;

                console.log(response.data);

                setProjects(response.data);

                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
                setLastPageUrl(response.data.last_page_url);
                setFirstPageUrl(response.data.first_page_url);

                if (prevPageUrl === null) {
                    setPrevPageUrl('');
                } else {
                    setPrevPageUrl(response.data.prev_page_url);
                }

                if (nextPageUrl === null) {
                    setNextPageUrl('');
                } else {
                    setNextPageUrl(response.data.next_page_url);
                }

                setIsloading(false);
            } catch (err) {
                if (axios.isCancel(err)) console.error(err);
            }
        };

        fetchProjects();

        return () => {
            source.cancel();
            mounted = false;
        };
    }, []);

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (prevPageUrl === '' || currentPage === 1) return;

        setIsloading(true);

        const source = axios.CancelToken.source();
        let mounted = true;

        const fetchProjects = async () => {
            try {
                const response = await axios.get(nextPageUrl, { cancelToken: source.token });

                if (!mounted) return;

                console.log(response.data);

                setProjects(response.data);

                setCurrentPage(response.data.current_page);
                setLastPageUrl(response.data.last_page_url);
                setFirstPageUrl(response.data.first_page_url);
                setNextPageUrl(response.data.next_page_url);

                if (prevPageUrl == null) {
                    setPrevPageUrl('');
                } else {
                    setPrevPageUrl(response.data.prev_page_url);
                }

                setIsloading(false);
            } catch (err) {
                if (axios.isCancel(err)) console.error(err);
            }
        };

        fetchProjects();

        return () => {
            source.cancel();
            mounted = false;
        };
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (nextPageUrl === '' || currentPage === lastPage) return;

        setIsloading(true);
        
        const source = axios.CancelToken.source();
        let mounted = true;

        const fetchProjects = async () => {
            try {
                const response = await axios.get(nextPageUrl, { cancelToken: source.token });

                if (!mounted) return;

                console.log(response.data);

                setProjects(response.data);

                setCurrentPage(response.data.current_page);
                setLastPageUrl(response.data.last_page_url);
                setFirstPageUrl(response.data.first_page_url);
                setPrevPageUrl(response.data.prev_page_url);

                if (nextPageUrl == null) {
                    setNextPageUrl('');
                } else {
                    setNextPageUrl(response.data.next_page_url);
                }

                setIsloading(false);
            } catch (err) {
                if (axios.isCancel(err)) console.error(err);
            }
        };

        fetchProjects();

        return () => {
            source.cancel();
            mounted = false;
        };
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
                        { projects!.data.map((project, i) => (
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

    if (prevPageUrl === '' || currentPage === 1) {
        prevButtonJsx = <Button disabled>Prev</Button>;
    } else {
        prevButtonJsx = <Button onClick={e => handlePrev(e)}>Prev</Button>;
    }

    if (nextPageUrl === '' || currentPage === lastPage) {
        nextButtonJsx = <Button disabled>Next</Button>;
    } else {
        nextButtonJsx = <Button onClick={e => handleNext(e)}>Next</Button>;
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
