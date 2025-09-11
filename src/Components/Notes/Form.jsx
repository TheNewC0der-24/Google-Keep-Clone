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
    boxShadow: 'none',
    padding: 0,
    borderRadius: 0,
    border: 'none',
    margin: 0,
    minHeight: '30px',
    backgroundColor: 'transparent',
    width: '100%',
}));

const note = {
    id: '',
    title: '',
    text: '',
}

const Form = ({ mode = 'create', forceOpen = false, initialNote = null, onSave, onCancel }) => {

    const [showTextField, setShowTextField] = useState(forceOpen);
    const [addNote, setAddNote] = useState(() => initialNote ? { ...initialNote } : { ...note, id: uuid() });

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
        setShowTextField(forceOpen ? true : false);
        if (containerRef.current) containerRef.current.style.minHeight = forceOpen ? '70px' : '30px';
        if (addNote.title || addNote.text) {
            if (onSave) {
                onSave(addNote);
            } else {
                setNotes(prevArr => [addNote, ...prevArr]);
            }
        } else {
            // empty -> cancel
            if (onCancel) onCancel();
        }
        setAddNote(initialNote ? { ...initialNote } : { ...note, id: uuid() });
        // Ensure inputs are blurred so global shortcuts work immediately
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    };

    // Listen for global request to open form (from shortcuts) only if not forced open
    useEffect(() => {
        if (forceOpen) return;
        const handler = () => openForm();
        window.addEventListener('open-note-form', handler);
        return () => window.removeEventListener('open-note-form', handler);
    }, [forceOpen]);

    // If initialNote changes (switching selection), load it
    useEffect(() => {
        if (initialNote) {
            setAddNote({ ...initialNote });
            setShowTextField(true);
            if (containerRef.current) containerRef.current.style.minHeight = '70px';
        }
    }, [initialNote]);

    // Global shortcuts while composing a note: Esc to close, Cmd/Ctrl+Enter to save & close
    useEffect(() => {
        const onKeyDown = (e) => {
            if (!showTextField) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                saveAndClose();
                return;
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
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
                                inputProps={{ dir: 'ltr' }}
                                sx={{
                                    mb: 1,
                                    '& .MuiInputBase-input': (theme) => ({
                                        ...theme.typography.h6,
                                        lineHeight: 1.25,
                                        padding: 0,
                                        color: theme.palette.text.primary,
                                    }),
                                    '& .MuiInputBase-input::placeholder': (theme) => ({
                                        color: theme.palette.text.secondary,
                                        opacity: 1,
                                    }),
                                }}
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
                        inputProps={{ dir: 'ltr' }}
                        onClick={() => {
                            openForm();
                        }}
                        onChange={(e) => onTextChange(e)}
                        name='text'
                        value={addNote.text}
                        inputRef={textRef}
                        minRows={12}
                        sx={{
                            flexGrow: 1,
                            '& .MuiInputBase-input': (theme) => ({
                                ...theme.typography.body1,
                                padding: 0,
                                whiteSpace: 'pre-wrap',
                                color: theme.palette.text.primary,
                            }),
                            '& .MuiInputBase-input::placeholder': (theme) => ({
                                color: theme.palette.text.secondary,
                                opacity: 1,
                            }),
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' || (e.metaKey && e.key === 'Enter') || (e.ctrlKey && e.key === 'Enter')) {
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
