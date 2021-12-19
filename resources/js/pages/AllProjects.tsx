import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../store';

import {
    Box,
    Button, 
    ButtonGroup, 
    Card, 
    CardContent, 
    CircularProgress, 
    Container, 
    Grid,
    Typography
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';

import { fetchProjects, setLoaded, setCurrentPage, setProjects } from '../store/projects';
import { RootState } from '../store';

interface Project {
    id: number,
    name: string,
    description: string,
    developer_company_name: string,
    client_company_name: string
}

const AllProjects = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { projects, last_page, loaded, current_page } = useSelector((state: RootState) => state.projectSlice);

    const [isLoading, setIsloading] = useState<boolean>(true);

    const [projectsJsx, setProjectsJsx] = useState<any>();
    const [prevButtonJsx, setPrevButtonJsx] = useState<any>();
    const [nextButtonJsx, setNextButtonJsx] = useState<any>();
    const [pageButtonsJsx, setPageButtonsJsx] = useState<any>();

    const handleProjectsLoad = () => {
        setIsloading(true);

        dispatch(fetchProjects(Number(current_page)))
            .unwrap()
            .then(result => {
                setIsloading(false);
            })
            .catch(err => console.error(err));
    };

    const handleRefresh = () => {
        handleProjectsLoad();
    };

    useEffect(() => {
        if (loaded) {
            setIsloading(false);
            return;
        }

        handleProjectsLoad();
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
        } else if (projects.length !== 0) {
            setProjectsJsx(
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            { projects.map((project: Project) => (
                                <Card key={project.name} sx={{ marginBottom: '25px' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>{ project.name }</Typography>
                                        <Typography variant="subtitle2" gutterBottom>{ project.description }</Typography>
                                        <Grid container spacing={1} justifyContent="center" alignItems="center">
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption">Client: { project.client_company_name }</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption">Develop By: { project.developer_company_name }</Typography>
                                            </Grid>
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ marginTop: '25px' }}
                                            onClick={() => navigate(`/project/${project.id}`)}
                                        >
                                            See More
                                        </Button>
                                    </CardContent>
                                </Card>
                            )) }
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        if (current_page == '1') {
            setPrevButtonJsx(<Button disabled>Prev</Button>);
        } else {
            setPrevButtonJsx(<Button onClick={handlePrev}>Prev</Button>);
        }

        if (current_page == String(last_page)) {
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

        if (projects.length === 0 && !isLoading) {
            setProjectsJsx(<Typography variant="h5">No projects found :(</Typography>);
            setPageButtonsJsx([]);
            setPrevButtonJsx([]);
            setNextButtonJsx([]);
        } else {
            setPageButtonsJsx(buttonsJsx);
        }
    }, [isLoading]);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Public projects Page: {current_page} <Button onClick={handleRefresh}><RefreshIcon color="primary" /></Button>
            </Typography>
            { projectsJsx }
            { !isLoading &&
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <ButtonGroup variant="contained" aria-label="navigation buttons">
                        { prevButtonJsx }
                        { pageButtonsJsx.map((btn: any) => btn) }
                        { nextButtonJsx }
                    </ButtonGroup>
                    {(projects.length !== 0) && (
                        <Typography mt={1} variant="h6" component="div">
                            Page: {current_page}
                        </Typography>
                    )}
                </Grid>
            }
        </Container>
    );
};

export default AllProjects;
