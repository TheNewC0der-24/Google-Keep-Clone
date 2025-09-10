import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, TextField, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    padding: 0,
    borderRadius: 0,
    border: 'none',
    backgroundColor: 'transparent',
}));

// Unified Note component: renders read-only view, edit, or create with identical styling
// Props: mode: 'create' | 'edit' | 'view'; initialNote?; onSave(note); onCancel()
const Editor = ({ mode = 'create', initialNote, onSave, onCancel }) => {
    const [title, setTitle] = useState(initialNote?.title || '');
    const [text, setText] = useState(initialNote?.text || '');

    const titleRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        if (mode === 'view') return;
        // Focus body first for faster typing
        setTimeout(() => {
            if (textRef.current) textRef.current.focus();
        }, 0);
    }, [mode]);

    // Keep internal state in sync when the selected note changes
    useEffect(() => {
        if (initialNote) {
            setTitle(initialNote.title || '');
            setText(initialNote.text || '');
        }
    }, [initialNote]);

    const save = useCallback(() => {
        const trimmedTitle = title.trim();
        const trimmedText = text.trim();
        if (!trimmedTitle && !trimmedText) {
            if (onCancel) onCancel();
            return;
        }
        const note = {
            id: initialNote?.id || uuid(),
            title: trimmedTitle,
            text: trimmedText,
        };
        onSave && onSave(note);
        // Blur so global shortcuts resume
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    }, [title, text, initialNote, onSave, onCancel]);

    useEffect(() => {
        if (mode === 'view') return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                // In edit mode, always save on Escape; in create mode, save if content, else cancel
                if (mode === 'edit') {
                    save();
                } else {
                    if (!title.trim() && !text.trim()) {
                        onCancel && onCancel();
                    } else {
                        save();
                    }
                }
                return;
            }
            // In edit mode, plain Enter should save (not insert newline)
            if (mode === 'edit' && e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                save();
                return;
            }
            if ((e.shiftKey && e.key === 'Enter') || ((e.metaKey || e.ctrlKey) && e.key === 'Enter')) {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [save, onCancel, title, text, mode]);

    if (mode === 'view') {
        return (
            <Container>
                <Stack spacing={1.5}>
                    <Typography variant="h6">{title || '(no title)'}</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Container>
            <Stack spacing={1.5}>
                <Typography
                    variant="h6"
                    contentEditable
                    suppressContentEditableWarning
                    ref={titleRef}
                    onInput={(e) => setTitle(e.currentTarget.innerText)}
                    sx={{
                        outline: 'none',
                        color: '#000',
                        lineHeight: 1.25,
                        minHeight: '1.2em',
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    contentEditable
                    suppressContentEditableWarning
                    ref={textRef}
                    onInput={(e) => setText(e.currentTarget.innerText)}
                    sx={{
                        outline: 'none',
                        color: '#000',
                        whiteSpace: 'pre-wrap',
                        minHeight: '12em',
                    }}
                >
                    {text}
                </Typography>
            </Stack>
        </Container>
    );
};

export default Editor;


