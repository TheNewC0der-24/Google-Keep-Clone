import React, { useState, useRef } from 'react';

import {
    Box,
    ClickAwayListener,
    TextField
} from '@mui/material';

import { styled } from '@mui/material/styles';

const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
    padding: 10px 15px;
    border-radius: 8px;
    border-color: "#e0e0e0";
    margin: auto;
    min-height: 30px;
`;

const Form = () => {

    const [showTextField, setShowTextField] = useState(false);

    const containerRef = useRef();

    return (
        <ClickAwayListener onClickAway={() => {
            setShowTextField(false);
            containerRef.current.style.minHeight = '30px';
        }}>
            <Container ref={containerRef}>
                {
                    showTextField && (
                        <TextField
                            size='small'
                            placeholder='Title'
                            variant='standard'
                            InputProps={{ disableUnderline: true }}
                            style={{ marginBottom: 10 }}
                        />
                    )
                }
                <TextField
                    multiline
                    placeholder='Take a note...'
                    variant='standard'
                    InputProps={{ disableUnderline: true }}
                    onClick={() => {
                        setShowTextField(true);
                        containerRef.current.style.minHeight = '70px';
                    }}
                />
            </Container>
        </ClickAwayListener>
    )
}

export default Form;