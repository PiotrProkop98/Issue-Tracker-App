import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchNewIssues } from '../store/issues';
import { Alert, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';

interface Issue {
  id: number,
  title: string,
  description: string,
  status: string,
  project_id: number
};

const NewIssues = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { newIssuesLoading, newIssues } = useSelector((state: RootState) => state.issuesSlice);
  const { token } = useSelector((state: RootState) => state.userSlice);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [startWorkingAlertJsx, setStartWorkingAlertJsx] = useState<any>(<></>);

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/');
    }
  }, []);

  const handleStartWorking = (issueId: number) => {
    setIsLoading(true);

    axios.get(`/api/issue/start-working/${issueId}`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(response => {
        setIsLoading(false);
        setStartWorkingAlertJsx(<Alert severity="success">Started working!</Alert>);

        setTimeout(() => {
          setStartWorkingAlertJsx(<></>);
          dispatch(fetchNewIssues(String(localStorage.getItem('token'))));
        }, 2000);
      })
      .catch(err => console.error(err));
  };

  return (
      <Container component="main" maxWidth="xs" sx={{ margin: '0 auto' }}>
          { newIssuesLoading && <CircularProgress /> }
          { isLoading && <CircularProgress /> }
          { !(newIssuesLoading) && !(isLoading) && (<>
            { newIssues.length === 0 && <Typography variant="h4">No new issues...</Typography> }
            <Grid container spacing={2}>
              { newIssues.map((issue: Issue, i: number) => (
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
                        onClick={() => handleStartWorking(issue.id)}
                      >Start working!</Button>
                    </CardActions>
                    { startWorkingAlertJsx }
                  </Card>
                </Grid>
              )) }
            </Grid>
          </>) }
      </Container>
  );
};

export default NewIssues;
