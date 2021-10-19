import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';

interface ParamTypes {
    id: string
}

const Project = () => {
    const { id } = useParams<ParamTypes>();

    return (
        <Box sx={{ margin: '100px 300px' }}>
            Project: { id }
        </Box>
    );
};

export default Project;
