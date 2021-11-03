import React from 'react';
import { useParams } from 'react-router-dom';

interface ParamTypes {
    id: string
}

const Issue = () => {
    const { id } = useParams<ParamTypes>();

    return (
        <div>
            Issue { id }
        </div>
    );
};

export default Issue;
