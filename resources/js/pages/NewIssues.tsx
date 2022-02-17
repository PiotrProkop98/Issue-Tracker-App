import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';

interface Issue {
  id: number,
  title: string,
  description: string,
  status: string,
  project_id: number
};

const NewIssues = () => {
  const navigate = useNavigate();

  const { newIssuesLoading, newIssues } = useSelector((state: RootState) => state.issuesSlice);

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/');
    }
  }, []);

  const handleStartWorking = (issueId: number) => {
    //
  };

  return (
      <Container component="main" maxWidth="xs" sx={{ margin: '0 auto' }}>
          { newIssuesLoading && <CircularProgress /> }
          { !(newIssuesLoading) && (<>
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
                        sx={{ marginTop: '25px' }}
                        onClick={() => handleStartWorking(issue.id)}
                      >Start working!</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )) }
            </Grid>
          </>) }
      </Container>
  );
};

export default NewIssues;
