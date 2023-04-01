import React, { useContext, useState, useEffect } from 'react';

import TrashNote from './TrashNote';

import { DataContext } from '../../Context/DataProvider';

import {
    Box,
    Typography,
    Grid,
    Container,
    Dialog,
    DialogTitle,
    DialogActions,
    Button
} from '@mui/material';

import { DeleteOutlineOutlined } from '@mui/icons-material';

const TrashNotes = () => {

    const { deletedNotes, setDeletedNotes } = useContext(DataContext);

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const deleteNote = () => {
        setDeletedNotes([]);
        handleCloseModal();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const filteredNotes = deletedNotes.filter(
                note => (now - note.createdAt) <= (7 * 24 * 60 * 60 * 1000)
            );
            setDeletedNotes(filteredNotes);
        }, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedNotes]);

    return (
        <React.Fragment>
            {
                deletedNotes.length === 0 ? (
                    <React.Fragment>
                        <Box>
                            <Typography align='center' variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                                Notes in Trash are deleted after 7 days.
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '8rem',
                        }}>
                            <DeleteOutlineOutlined sx={{
                                backgroundSize: '120px 120px',
                                height: '120px',
                                margin: '20px',
                                opacity: '.1',
                                width: '120px',
                            }} />
                            <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                                No notes in Trash
                            </Typography>
                        </Box>
                    </React.Fragment>
                ) :
                    (
                        <Container maxWidth="lg">
                            <Box sx={{
                                display: "flex",
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 'auto',
                                gap: '1rem',
                                mb: 3
                            }}>
                                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                                    Notes in Trash are deleted after 7 days.
                                </Typography>
                                <Button sx={{ textTransform: "capitalize" }} onClick={handleOpenModal}>
                                    Empty Trash
                                </Button>
                            </Box>

                            <Grid spacing={2} container>
                                {
                                    deletedNotes.map(trashNote => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <TrashNote trashNote={trashNote} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Container>
                    )
            }

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                sx={{ '& .MuiDialog-paper': { width: { xs: '300px', sm: '300px', md: '400px' }, maxWidth: { sm: '50%', md: '70%', lg: '90%' } } }}
            >
                <DialogTitle sx={{ fontSize: ".875rem", color: "#3c4043" }}>
                    Empty trash? All notes in Trash will be permanently deleted.
                </DialogTitle>
                <DialogActions>
                    <Button variant='dark' onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={deleteNote} autoFocus>
                        Empty Trash
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    )
}

export default TrashNotes;