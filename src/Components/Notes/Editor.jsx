import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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
    const textRef = useRef();

    useEffect(() => {
        if (mode === 'view') return;
        // Focus body first for faster typing
        setTimeout(() => {
            if (textRef.current) textRef.current.focus();
        }, 0);
    }, [mode]);

    // Sync DOM content with selected note changes
    useEffect(() => {
        if (mode === 'view') return;
        if (textRef.current) textRef.current.innerText = initialNote?.text || '';
    }, [initialNote, mode]);

    const save = useCallback(() => {
        const currentText = textRef.current?.innerText || '';
        const trimmedText = currentText.trim();
        if (!trimmedText) {
            if (onCancel) onCancel();
            return;
        }
        const note = {
            id: initialNote?.id || uuid(),
            text: trimmedText,
        };
        onSave && onSave(note);
        // Blur so global shortcuts resume
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    }, [initialNote, onSave, onCancel]);

    useEffect(() => {
        if (mode === 'view') return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                // In edit mode, always save on Escape; in create mode, save if content, else cancel
                if (mode === 'edit') {
                    save();
                } else {
                    const b = textRef.current?.innerText || '';
                    if (!b.trim()) {
                        onCancel && onCancel();
                    } else {
                        save();
                    }
                }
                return;
            }
            // Enter should insert a newline, never save
            // Keep Cmd/Ctrl+Enter as an explicit save shortcut
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [save, onCancel, mode]);

    if (mode === 'view') {
        return (
            <Container>
                <Stack spacing={1.5}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{initialNote?.text}</Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Container>
            <Stack spacing={1.5}>
                <Typography
                    variant="body1"
                    contentEditable
                    suppressContentEditableWarning
                    ref={textRef}
                    sx={{
                        outline: 'none',
                        color: '#000',
                        whiteSpace: 'pre-wrap',
                        minHeight: '12em',
                    }}
                    dir="ltr"
                >
                    {/* content set via ref */}
                </Typography>
            </Stack>
        </Container>
    );
};

export default Editor;
