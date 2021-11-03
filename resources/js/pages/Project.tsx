import React, { ReactElement, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
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

interface IssueData {
    id: number,
    title: string,
    description: string,
    status: string,
    project_id: number,
    user_id: number,
    created_at: string,
    updated_at: string
}

const Project = () => {
    const { id } = useParams<ParamTypes>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [project, setProject] = useState<ProjectData>();
    const [isIssuesLoading, setIsIssuesLoading] = useState<boolean>(false);
    const [issues, setIssues] = useState<IssueData[]>();
    const [issueJsx, setIssueJsx] = useState<ReactElement>();

    useEffect(() => {
        setIsLoading(true);
        setIsIssuesLoading(true);

        axios.get(`/api/projects/${id}`)
            .then(response => {
                setIsLoading(false);
                setProject(response.data);

                axios.get(`/api/issues/${id}`)
                    .then(response => {
                        setIssues(response.data);
                        setIsIssuesLoading(false);
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setIssueJsx(
            <List sx={{ width: '100%' }} component="nav">
                { issues?.map((issue: IssueData, i: number) => {
                    return (
                        <div key={i}>
                            <Link to={`/issue/${issue.id}`} className="link">
                                <ListItem button key={i}>
                                    <ListItemText primary={ 
                                        `Issue: ${issue.title} | Status: ${issue.status} | Added: ${issue.created_at}`
                                        } />
                                </ListItem>
                            </Link>
                            <Divider />
                        </div>
                    );
                }) }
            </List>
        );
    }, [issues]);

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
                    { isIssuesLoading ? <CircularProgress sx={{ marginBottom: '20px' }} /> : issueJsx }
                </Grid>
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
