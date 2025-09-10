import React, { useState, useRef, useContext, useEffect } from 'react';

import {
    Box,
    Container as MuiContainer,
    ClickAwayListener,
    TextField
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { v4 as uuid } from 'uuid';

import { DataContext } from '../../Context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.palette.mode === 'dark' 
        ? '0 1px 2px 0 rgba(255,255,255,0.1), 0 2px 6px 2px rgba(255,255,255,0.05)'
        : '0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%)',
    padding: '10px 15px',
    borderRadius: '8px',
    borderColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
    margin: 'auto',
    marginBottom: '2rem',
    minHeight: '30px',
    backgroundColor: theme.palette.background.paper,
}));

const note = {
    id: '',
    title: '',
    text: '',
}

const Form = () => {

    const [showTextField, setShowTextField] = useState(false);
    const [addNote, setAddNote] = useState({ ...note, id: uuid() });

    const { setNotes } = useContext(DataContext);

    const containerRef = useRef();
    const titleRef = useRef();
    const textRef = useRef();

    const openForm = () => {
        setShowTextField(true);
        if (containerRef.current) containerRef.current.style.minHeight = '70px';
        // Focus body input
        setTimeout(() => {
            if (textRef.current) textRef.current.focus();
        }, 0);
    };

    const saveAndClose = () => {
        setShowTextField(false);
        if (containerRef.current) containerRef.current.style.minHeight = '30px';
        if (addNote.title || addNote.text) {
            setNotes(prevArr => [addNote, ...prevArr]);
        }
        setAddNote({ ...note, id: uuid() });
        // Ensure inputs are blurred so global shortcuts work immediately
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    };

    // Listen for global request to open form (from shortcuts)
    useEffect(() => {
        const handler = () => openForm();
        window.addEventListener('open-note-form', handler);
        return () => window.removeEventListener('open-note-form', handler);
    }, []);

    // Close editor on global Escape even if input isn't focused
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && showTextField) {
                e.preventDefault();
                saveAndClose();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [showTextField, addNote]);

    const onTextChange = (e) => {
        let changedNote = { ...addNote, [e.target.name]: e.target.value }
        setAddNote(changedNote);
    }

    return (
        <ClickAwayListener onClickAway={() => {
            saveAndClose();
        }}>
            <MuiContainer maxWidth='sm'>
                <Container ref={containerRef}>
                    {
                        showTextField && (
                            <TextField
                                size='small'
                                placeholder='Title'
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                                style={{ marginBottom: 10 }}
                                onChange={(e) => onTextChange(e)}
                                name='title'
                                value={addNote.title}
                                inputRef={titleRef}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter')) {
                                        e.preventDefault();
                                        saveAndClose();
                                    }
                                }}
                            />
                        )
                    }
                    <TextField
                        multiline
                        placeholder='Take a note...'
                        variant='standard'
                        InputProps={{ disableUnderline: true }}
                        onClick={() => {
                            openForm();
                        }}
                        onChange={(e) => onTextChange(e)}
                        name='text'
                        value={addNote.text}
                        inputRef={textRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter')) {
                                e.preventDefault();
                                saveAndClose();
                            }
                        }}
                    />
                </Container>
            </MuiContainer>
        </ClickAwayListener>
    )
}

export default Form;