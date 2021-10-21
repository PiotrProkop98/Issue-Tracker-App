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
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{ project?.name }</Typography>
                            <Grid container spacing={1} direction="row" justifyContent="center">
                                <Grid item xs={6}>
                                    <Typography variant="caption">Developer: { project?.developer_company_name }</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption">Client: { project?.developer_company_name }</Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body2">{ project?.description }</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Card>
                        Issues
                    </Card>
                </Grid>
                { projectJsx }
            </Grid>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box>
                { returnJsx }
            </Box>
        </Container>
    );
};

export default Project;
