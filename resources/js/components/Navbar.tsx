import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { logout, setUserFromLocalStorage } from '../store/user';
import { setLoggedOutLinks, setLoggedInLinks } from '../store/links';
import { fetchNewIssues } from '../store/issues';

import {
AppBar,
Box,
IconButton,
Toolbar,
Typography,
Menu,
List,
ListItem,
ListItemIcon,
ListItemText,
Drawer
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const Navbar = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { newIssues } = useSelector((state: RootState) => state.issuesSlice);

    const { username } = useSelector((state: RootState) => state.userSlice);
    const { links, urls } = useSelector((state: RootState) => state.linksSlice);

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logoutUser = (e: any) => {
        e.preventDefault();

        dispatch(logout());
        dispatch(setLoggedOutLinks());

        navigate('/');
    }

    useEffect(() => {
        dispatch(setLoggedOutLinks());

        if (localStorage.getItem('username') !== null) {
            dispatch(setUserFromLocalStorage());
            dispatch(setLoggedInLinks());

            if (newIssues.length === 0) {
                dispatch(fetchNewIssues(String(localStorage.getItem('token'))));
            }
        }
    }, [])

    const drawerWidth = 240;

    const drawer = (
        <List>
            {links.map((text, i) => (
                <Link to={urls[i]} onClick={handleDrawerToggle} className="link" key={i}>
                    <ListItem button>
                            <ListItemIcon>
                                <DoubleArrowIcon />
                            </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                </Link>
            ))}
        </List>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, cursor: 'pointer'}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" className="link">Bug tracker app</Link>
                    </Typography>
                    { (localStorage.getItem('username') != null) && (<>
                            <Typography variant="caption" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
                                <Box sx={{ display: { xs: 'block', sm: 'flex' } }}>
                                    <Typography component="div" sx={{ flexGrow: 3, textAlign: 'right' }}>
                                        <Link to="#" className="link" onClick={(e: any) => logoutUser(e)}>
                                            Hello { username }, logout here
                                        </Link>
                                    </Typography>
                                    <Typography component="div" sx={{ flexGrow: 1 }}>
                                        <Link to="/new-issues" className="link">
                                            You have { newIssues.length } new issues
                                        </Link>
                                    </Typography>
                                </Box>
                            </Typography>
                        </>)
                    }
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    { drawer }
                </Drawer>
            </Box>
        </Box>
    );
};

export default Navbar;
