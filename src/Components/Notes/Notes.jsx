import React, { useContext, useEffect, useState, useCallback } from 'react';

import Form from './Form';
import Note from './Note';
import Editor from './Editor';

import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Container, Grid, Dialog, DialogTitle, DialogContent, Divider, List, ListItem, ListItemText } from '@mui/material';

import { LightbulbOutlined } from '@mui/icons-material';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const Notes = () => {

    const { notes, setNotes } = useContext(DataContext);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mode, setMode] = useState('create'); // 'create' | 'neutral' | 'view' | 'edit'
    const [openDialog, setOpenDialog] = useState(false);
    const [openedNote, setOpenedNote] = useState(null);
    const [query, setQuery] = useState('');

    const clampIndex = useCallback((idx) => {
        if (notes.length === 0) return 0;
        if (idx < 0) return 0;
        if (idx >= notes.length) return notes.length - 1;
        return idx;
    }, [notes.length]);

    const onDragEnd = (result) => {
        if (!result.destination)
            return;

        const items = reorder(notes, result.source.index, result.destination.index);
        setNotes(items);
    }

    // Receive search queries from Navbar
    useEffect(() => {
        const onSearch = (e) => setQuery(e.detail || '');
        window.addEventListener('notes-search', onSearch);
        return () => window.removeEventListener('notes-search', onSearch);
    }, []);

    const filteredNotes = notes.filter(n => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (n.title || '').toLowerCase().includes(q) || (n.text || '').toLowerCase().includes(q);
    });

    // Global keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e) => {
            // Ignore when typing in inputs/textareas
            const tag = document.activeElement?.tagName?.toLowerCase();
            const isTyping = tag === 'input' || tag === 'textarea';

            // Global shortcuts only in neutral mode
            if (mode !== 'neutral') return;

            // C: create/open form
            if (!isTyping && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                setMode('create');
                return;
            }

            // J / K navigation – move selection and keep neutral mode; show read-only
            if (!isTyping && (e.key === 'j' || e.key === 'k' || e.key === 'J' || e.key === 'K')) {
                e.preventDefault();
                const direction = e.key.toLowerCase() === 'j' ? 1 : -1;
                const max = Math.max(filteredNotes.length - 1, 0);
                const next = Math.min(Math.max(selectedIndex + direction, 0), max);
                setSelectedIndex(next);
                return;
            }

            // Enter to open selected note in edit mode
            if (!isTyping && e.key === 'Enter' && filteredNotes.length > 0) {
                e.preventDefault();
                const idx = clampIndex(selectedIndex);
                setSelectedIndex(idx);
                setMode('edit');
                return;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [filteredNotes, selectedIndex, clampIndex, mode]);

    return (
        <React.Fragment>

            {
                notes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '5rem',
                    }}>
                        <LightbulbOutlined sx={{
                            backgroundSize: '120px 120px',
                            height: '120px',
                            margin: '20px',
                            opacity: '.1',
                            width: '120px',
                        }} />
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="text.secondary">
                            Notes you add appear here
                        </Typography>
                    </Box>
                ) :
                    (
                        <Container maxWidth="xl">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4} lg={3} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                                    <List sx={{ p: 0 }}>
                                        {filteredNotes.map((note, index) => (
                                            <ListItem key={note.id} selected={index === selectedIndex} button onClick={() => { setSelectedIndex(index); setMode('neutral'); }} sx={{ alignItems: 'flex-start' }}>
                                                <ListItemText
                                                    primary={<Typography variant="subtitle1" noWrap>{note.title || '(no title)'}</Typography>}
                                                    secondary={<Typography variant="body2" color="text.secondary" noWrap>{note.text}</Typography>}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={8} lg={9}>
                                    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {mode === 'create' && (
                                            <Editor
                                                mode='create'
                                                onSave={(note) => {
                                                    setNotes(prev => [note, ...prev]);
                                                    setMode('neutral');
                                                }}
                                                onCancel={() => setMode('neutral')}
                                            />
                                        )}
                                        {(mode === 'view' || mode === 'neutral') && filteredNotes[selectedIndex] && (
                                            <Editor
                                                mode='view'
                                                initialNote={filteredNotes[selectedIndex]}
                                            />
                                        )}
                                        {mode === 'edit' && filteredNotes[selectedIndex] && (
                                            <Editor
                                                mode='edit'
                                                initialNote={filteredNotes[selectedIndex]}
                                                onSave={(updated) => {
                                                    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
                                                    setMode('neutral');
                                                }}
                                                onCancel={() => setMode('neutral')}
                                            />
                                        )}
                                        {mode === 'neutral' && null}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    )
            }

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{openedNote?.title}</DialogTitle>
                <DialogContent>
                    <Typography>{openedNote?.text}</Typography>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default Notes;