import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

interface Ref {
    contains: any
};

interface Props {
    inputText: string,
    label: string,
    isInputLoading: boolean,
    inputAlertJsx: any,
    setNewInput: any,
    handleInputSubmit: any
};

const Input = (props: Props) => {
    const ref = useRef<Ref>();

    const [showInput, setShowInput] = useState<boolean>(false);

    useEffect(() => {
        const hideInput = (e: any) => {
            if (showInput && ref.current && !ref.current.contains(e.target)) {
                setShowInput(false);
            }
        };

        document.addEventListener('mousedown', hideInput);

        return () => {
            document.removeEventListener('mousedown', hideInput);
        }
    }, [showInput]);

    return (
        <Typography gutterBottom variant="h5" component="div">
            {!(showInput) && (<>
                { props.inputText } <Button onClick={() => setShowInput(!showInput)}>Change</Button>
            </>)}
            {(showInput && !(props.isInputLoading) && (
                <Box ref={ref} sx={{ display: 'inline' }}>
                    <TextField
                        label={props.label}
                        variant="standard"
                        size="small"
                        sx={{
                            transform: 'translateY(-15px)'
                        }}
                        onChange={(e: any) => props.setNewInput(e.target.value)}
                    />
                    <Button onClick={props.handleInputSubmit}>Submit change</Button>
                </Box>
            ))}
            {props.isInputLoading && (<CircularProgress />)}
            {props.inputAlertJsx}
        </Typography>
    );
};

export default Input;

