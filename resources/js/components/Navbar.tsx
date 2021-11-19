import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { RootState, useAppDispatch } from '../store';
import { logout, setUserFromLocalStorage } from '../store/user';

import { AppBar, Box, Button, IconButton, Toolbar, Typography, Menu, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const dispatch = useAppDispatch();
    dispatch(setUserFromLocalStorage());

    const { username } = useSelector((state: RootState) => state.userSlice);

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logoutUser = (e: any) => {
        e.preventDefault();
        dispatch(logout());
    }

    const drawerWidth = 240;

    let links = [
        'Public projects',
        'Log in',
        'Sing up'
    ];
    
    let urls = [
        '/',
        '/login',
        '/register'
    ];

    if (localStorage.getItem('token') === '') {
        links = [
            'Public projects'
        ];

        urls = [
            '/'
        ];
    }

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

    console.log(username);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{
                width: { lg: `calc(100% - ${drawerWidth}px)` },
                ml: { lg: `${drawerWidth}px` }
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, cursor: 'pointer', display: { xs: 'block', lg: 'none' }}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" className="link">Bug tracker app</Link>
                    </Typography>
                    { (username !== '') && 
                        <Typography variant="caption" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
                            <Link to="#" className="link" onClick={(e: any) => logoutUser(e)}>
                                Hello { username }, logout here
                            </Link>
                        </Typography>
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
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    { drawer }
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', lg: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                    open
                    >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

export default Navbar;
