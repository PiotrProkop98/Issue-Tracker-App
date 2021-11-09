import React from 'react';
import { Box } from '@mui/system';
import { Container, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" paddingTop={6}>
            <Container maxWidth="md">
                <Typography component="p" variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ fontSize: '1.2rem' }}>
                    Issue Tracker App 2021
                </Typography>
                <Typography component="p" variant="subtitle2" align="center" color="text.secondary" gutterBottom>
                    License MIT
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
