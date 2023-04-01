import React, { useState, useContext } from 'react';

import { Card, CardActions, CardContent, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ArchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';

import { DataContext } from '../../Context/DataProvider';

const NoteCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;

    &:hover {
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
    }
`;

const Note = ({ note }) => {

    const [showActions, setShowActions] = useState(false);

    const { notes, setNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);

    const archiveNote = (note) => {
        const updatedNotes = notes.filter(data => data.id !== note.id);
        setNotes(updatedNotes);
        setArchivedNotes(prevArr => [...prevArr, note]);
    }

    const deleteNote = (note) => {
        const updatedNotes = notes.filter(data => data.id !== note.id);
        setNotes(updatedNotes);
        setDeletedNotes(prevArr => [...prevArr, note]);
    }

    return (
        <NoteCard
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent sx={{ wordWrap: "break-word" }}>
                <Typography>{note.title}</Typography>
                <Typography>{note.text}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                <Tooltip title="Archive">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => archiveNote(note)}
                    >
                        <ArchiveOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => deleteNote(note)}
                    >
                        <DeleteOutlineOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </NoteCard>
    )
}

export default Note;