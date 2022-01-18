import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../store';

interface Member {
    id: number,
    name: string
};

const IssueAssign = () => {
    const navigate = useNavigate();

    const { issue_id } = useParams<string>();

    const { username, id, token} = useSelector((state: RootState) => state.userSlice);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [members, setMembers] = useState<Member[]>([]);

    const [showDialog, setShowDialog] = useState<boolean>(false);

    const showUserAssignAlert = () => {
        setShowDialog(true);
    };

    const hideDialog = () => {
        setShowDialog(false);
    };

    const assignIssue = () => {
        setIsLoading(true);

        axios.post(`/api/issue/assign`, { user_id: id, issue_id: issue_id }, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                setIsLoading(false);
                navigate(`/issue/${issue_id}`);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (localStorage.getItem('username') === null) {
            navigate('/');
        }

        setIsLoading(true);

        axios.get(`/api/project/get-by-issue-id/${issue_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(response => {
                const project_id = response.data.project_id;

                axios.get(`/api/project/${id}/${project_id}`, { headers: { 'Authorization': `Bearer ${token}` }})
                    .then(response2 => {
                        if (response2.data.allowed == true) {
                            axios.get(
                                `/api/user/get-project-members/${project_id}`,
                                { headers: { 'Authorization': `Bearer ${token}` }}
                            ).then(response3 => {
                                setMembers(response3.data.users);
                                setIsLoading(false);
                            })
                        }
                    })
                    .catch(() => {
                        setIsLoading(false);
                    });
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            {isLoading && <CircularProgress />}
            {!(isLoading) && (<>
                <List component="nav" aria-label="Project members">
                    {members.map((member: Member, i: number) => (
                        <ListItem button key={i}>
                            <ListItemText primary={member.name} onClick={showUserAssignAlert} />
                        </ListItem>
                    ))}
                </List>
                <Dialog
                    open={showDialog}
                    onClose={hideDialog}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">
                        Are you SURE you want to assign this issue to this user?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={hideDialog}>Close</Button>
                        <Button onClick={assignIssue} autoFocus>Assign</Button>
                    </DialogActions>
                </Dialog>
            </>)}
        </>
    );
};

export default IssueAssign;
