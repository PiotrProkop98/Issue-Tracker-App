import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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

    useEffect(() => {
        setIsloading(true);

        axios.get('http://localhost:8100/api/projects')
            .then(response => {
                console.log(response.data);
                setProjects(response.data);
                setIsloading(false);
            })
            .catch(err => console.error(err));
    }, []);

    let projectsJsx;

    if (isLoading) {
        projectsJsx = <CircularProgress />;
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

    return (
        <Container maxWidth="xs">
            { projectsJsx }
        </Container>
    );
};

export default AllProjects;
