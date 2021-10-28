import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Typography
} from '@mui/material';

interface ParamTypes {
    id: string
}

interface ProjectData {
    id: number,
    name: string,
    description: string,
    developer_company_name: string,
    client_company_name: string,
    is_private: boolean,
    created_at: string,
    updated_at: string
}

const Project = () => {
    const { id } = useParams<ParamTypes>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [project, setProject] = useState<ProjectData>();
    const [projectJsx, setProjectJsx] = useState<ReactElement>();

    useEffect(() => {
        setIsLoading(true);

        axios.get(`/api/projects/${id}`)
            .then(response => {
                setIsLoading(false);
                setProject(response.data);
                setProjectJsx(
                    <Box>
                        { project }
                    </Box>
                );
            })
            .catch(err => setProjectJsx(<Typography>500 Server Error</Typography>));
    }, []);

    let returnJsx;

    if (isLoading) {
        returnJsx = <CircularProgress sx={{ marginBottom: '20px' }} />;
    } else {
        returnJsx = (
            <Grid container spacing={2} direction="row" justifyContent="center">
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Project: { project?.name }</Typography>
                            <Typography variant="body1" gutterBottom>{ project?.description }</Typography>
                            <Grid container spacing={1} direction="row" justifyContent="center">
                                <Grid item xs={6}>
                                    <Typography variant="h6">Developer: { project?.developer_company_name }</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Client: { project?.client_company_name }</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        Issues
                    </Card>
                </Grid>
                { projectJsx }
            </Grid>
        );
    }

    return (
        <Container maxWidth="md">
            <Box>
                { returnJsx }
            </Box>
        </Container>
    );
};

export default Project;
