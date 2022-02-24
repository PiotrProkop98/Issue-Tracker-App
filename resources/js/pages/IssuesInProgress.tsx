import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
    Card,
    Container,
    Typography,
    CircularProgress,
    Grid,
    CardContent,
    CardActions,
    Button,
    Alert
} from '@mui/material';

interface Issue {
    id: number,
    title: string,
    description: string,
    status: string,
    project_id: number,
    user_id: number
};

const IssuesInProgress = () => {
    const navigate = useNavigate();

    const { token } = useSelector((state: RootState) => state.userSlice);

    const [issuesInProgress, setIssuesInProgress] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertJsx, setAlertJsx] = useState<any>(<></>);

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get('/api/issues/work-in-progress', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);
                setIssuesInProgress(response.data.issues);
            })
            .catch(err => console.error(err));
    }, []);

    const handleMarkAsFinished = (issueId: number) => {
      setIsLoading(true);

      axios.post('/api/issues/mark-as-finished', { issue_id: issueId }, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(() => {
          axios.get('/api/issues/work-in-progress', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
              setIsLoading(false);
              setIssuesInProgress(response.data.issues);

              setAlertJsx(<Alert severity="success" sx={{ marginTop: '10px' }}>Issue marked as finished!</Alert>);

              setTimeout(() => {
                setAlertJsx(<></>);
              }, 2000);
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ margin: '0 auto' }}>
            { isLoading && <CircularProgress /> }
            { !(isLoading) && (<>
            { issuesInProgress.length === 0 && <Typography variant="h4">No issues in progress...</Typography> }
            <Grid container spacing={2}>
              { alertJsx }
              { issuesInProgress.map((issue: Issue, i: number) => (
                <Grid item xs={12} key={i}>
                  <Card>
                    <CardContent>
                      <>
                        <Typography variant="h5" gutterBottom>Issue: { issue.title }</Typography>
                        <Typography variant="body1" gutterBottom>Problem description: { issue.description }</Typography>
                        <Typography variant="h6" gutterBottom>Current status: { issue.status }</Typography>
                      </>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleMarkAsFinished(issue.id)}
                      >Mark as finished!</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )) }
            </Grid>
          </>) }
      </Container>
    );
};

export default IssuesInProgress;