import React, { useContext, useEffect } from 'react';

import TrashNote from './TrashNote';

import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Grid, Container, Button } from '@mui/material';

import { DeleteOutlineOutlined } from '@mui/icons-material';

const TrashNotes = () => {

    const { deletedNotes, setDeletedNotes } = useContext(DataContext);

    const deleteNote = () => {
        setDeletedNotes([]);
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
                            <Box mb={3} sx={{
                                display: "flex",
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 'auto',
                                gap: '1rem',
                            }}>
                                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                                    Notes in Trash are deleted after 7 days.
                                </Typography>
                                <Button sx={{ textTransform: "capitalize" }} onClick={deleteNote}>
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
        </React.Fragment>
    )
}

export default TrashNotes;