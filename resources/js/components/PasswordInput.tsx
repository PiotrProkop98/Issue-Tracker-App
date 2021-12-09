import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

interface Ref {
    contains: any
};

interface Props {
    isPasswordLoading: boolean,
    passwordAlertJsx: any,
    setOldPassword: any,
    setNewPassword: any,
    handlePasswordSubmit: any
};

const PasswordInput = (props: Props) => {
    const ref = useRef<Ref>();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        const hideInput = (e: any) => {
            if (showPassword && ref.current && !ref.current.contains(e.target)) {
                setShowPassword(false);
            }
        };

        document.addEventListener('mousedown', hideInput);

        return () => {
            document.removeEventListener('mousedown', hideInput);
        }
    }, [showPassword]);

    return (
        <Box>
            {!(showPassword) && (<>
                <Button onClick={() => setShowPassword(!showPassword)}>Change Password</Button>
            </>)}
            {(showPassword && !(props.isPasswordLoading) && (
                <Box ref={ref} sx={{ display: 'inline' }}>
                    <TextField
                        label="Old password"
                        type="password"
                        variant="standard"
                        size="small"
                        sx={{
                            transform: 'translateY(-15px)'
                        }}
                        onChange={(e: any) => props.setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="New password"
                        type="password"
                        variant="standard"
                        size="small"
                        sx={{
                            transform: 'translateY(-15px)'
                        }}
                        onChange={(e: any) => props.setNewPassword(e.target.value)}
                    />
                    <Button onClick={props.handlePasswordSubmit}>Submit change</Button>
                </Box>
            ))}
            {props.isPasswordLoading && (<CircularProgress />)}
            {props.passwordAlertJsx}
        </Box>
    );
};

export default PasswordInput;
