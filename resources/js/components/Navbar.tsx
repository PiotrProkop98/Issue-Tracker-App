import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Box, Button, IconButton, Toolbar, Typography, Menu, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { margin } from '@mui/system';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    const links = [
        'Public projects',
        'Your projects',
        'Log in'
    ];
    
    const urls = [
        '/',
        '/your-projects',
        '/login'
    ];

    const drawer = (
        <List>
            {links.map((text, i) => (
                <Link to={urls[i]} onClick={handleDrawerToggle} className="link">
                    <ListItem button key={text}>
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
            <AppBar position="fixed" sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` }
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, cursor: 'pointer' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" className="link">Bug tracker app</Link>
                    </Typography>
                    <Link to="/login"  className="link">
                        <Button color="inherit">Login</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    { drawer }
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
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
