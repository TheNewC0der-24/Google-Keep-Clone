import React, { useContext, useEffect, useState, useCallback } from 'react';

import Form from './Form';
import Note from './Note';

import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Container, Grid, Dialog, DialogTitle, DialogContent } from '@mui/material';

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
    const [openDialog, setOpenDialog] = useState(false);
    const [openedNote, setOpenedNote] = useState(null);

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

    // Global keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e) => {
            // Ignore when typing in inputs/textareas
            const tag = document.activeElement?.tagName?.toLowerCase();
            const isTyping = tag === 'input' || tag === 'textarea';

            // C: create/open form
            if (!isTyping && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                window.dispatchEvent(new Event('open-note-form'));
                return;
            }

            // J / K navigation
            if (!isTyping && (e.key === 'j' || e.key === 'k' || e.key === 'J' || e.key === 'K')) {
                e.preventDefault();
                setSelectedIndex((prev) => clampIndex(prev + (e.key.toLowerCase() === 'j' ? 1 : -1)));
                return;
            }

            // Enter to open selected note
            if (!isTyping && e.key === 'Enter' && notes.length > 0) {
                e.preventDefault();
                const note = notes[clampIndex(selectedIndex)];
                setOpenedNote(note);
                setOpenDialog(true);
                return;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [notes, selectedIndex, clampIndex]);

    return (
        <React.Fragment>
            <Form />

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
                        <Container maxWidth="lg">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <Grid spacing={2} container
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {
                                                notes.map((note, index) => (
                                                    <Draggable key={note.id} draggableId={note.id} index={index}>
                                                        {(provided) => (
                                                            <Grid item xs={12} sm={6} md={4} lg={3}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                sx={{ outline: index === selectedIndex ? '2px solid #1976d2' : 'none', outlineOffset: '2px', borderRadius: '8px' }}
                                                            >
                                                                <Note note={note} />
                                                            </Grid>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                        </Grid>
                                    )}
                                </Droppable>
                            </DragDropContext>
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