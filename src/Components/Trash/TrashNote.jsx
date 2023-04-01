import React, { useState, useContext } from 'react';

import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { DeleteForeverOutlined, RestoreFromTrashOutlined } from '@mui/icons-material';

import { DataContext } from '../../Context/DataProvider';

const TrashCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const TrashNote = ({ trashNote }) => {

    const [showActions, setShowActions] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const { setNotes, deletedNotes, setDeletedNotes } = useContext(DataContext);

    const deleteNote = (trashNote) => {
        const updatedNotes = deletedNotes.filter(data => data.id !== trashNote.id);
        setDeletedNotes(updatedNotes);
        handleCloseModal();
    }

    const restoreNote = (trashNote) => {
        const updatedNotes = deletedNotes.filter(data => data.id !== trashNote.id);
        setDeletedNotes(updatedNotes);
        setNotes(prevArr => [...prevArr, trashNote]);
    }

    return (
        <React.Fragment>
            <TrashCard
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <CardContent sx={{ wordWrap: "break-word" }}>
                    <Typography>{trashNote.title}</Typography>
                    <Typography>{trashNote.text}</Typography>
                </CardContent>
                <CardActions>
                    <Tooltip title="Delete Forever">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={handleOpenModal}
                        >
                            <DeleteForeverOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Restore">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={() => restoreNote(trashNote)}
                        >
                            <RestoreFromTrashOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </TrashCard>

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                // sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '90%' } }}
                sx={{ '& .MuiDialog-paper': { width: { xs: '300px', sm: '300px', md: '400px' }, maxWidth: { sm: '50%', md: '70%', lg: '90%' } } }}
            >
                <DialogTitle sx={{ fontSize: "18px" }}>
                    Delete note forever?
                </DialogTitle>
                <DialogActions>
                    <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={() => deleteNote(trashNote)} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default TrashNote;