import React, { useState, useContext } from 'react';

import { Card, CardActions, CardContent, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { UnarchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';

import { DataContext } from '../../Context/DataProvider';

const ArchiveCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const Archive = ({ archiveNote }) => {

    const [showActions, setShowActions] = useState(false);

    const { setNotes, archivedNotes, setArchivedNotes, setDeletedNotes } = useContext(DataContext);

    const unarchiveNote = (archiveNote) => {
        const updatedNotes = archivedNotes.filter(data => data.id !== archiveNote.id);
        setArchivedNotes(updatedNotes);
        setNotes(prevArr => [...prevArr, archiveNote]);
    }

    const deleteNote = (archiveNote) => {
        const updatedNotes = archivedNotes.filter(data => data.id !== archiveNote.id);
        setArchivedNotes(updatedNotes);
        setDeletedNotes(prevArr => [...prevArr, archiveNote]);
    }

    return (
        <ArchiveCard
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent sx={{ wordWrap: "break-word" }}>
                <Typography>{archiveNote.title}</Typography>
                <Typography>{archiveNote.text}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                <Tooltip title="Unarchive">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => unarchiveNote(archiveNote)}
                    >
                        <UnarchiveOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => deleteNote(archiveNote)}
                    >
                        <DeleteOutlineOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </ArchiveCard>
    )
}

export default Archive;