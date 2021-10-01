import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

const Navbar = () => {
    return (
        <Box>
            <Breadcrumbs>
                <Typography color="text.primary">
                    <Link underline="hover" color="inherit" href="/" sx={{fontSize: '1.1rem'}}>Bug tracker app</Link>
                </Typography>
                <Link underline="hover" color="inherit" href="/" sx={{fontSize: '1.1rem'}}>
                    Public projects
                </Link>
                <Link underline="hover" color="inherit" href="/your-projects" sx={{fontSize: '1.1rem'}}>
                    Your projects
                </Link>
            </Breadcrumbs>
        </Box>
    );
};

export default Navbar;
