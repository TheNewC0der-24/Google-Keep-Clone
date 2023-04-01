import React, { useContext } from 'react';

import TrashNote from './TrashNote';

import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Grid, Container, Button } from '@mui/material';

import { DeleteOutlineOutlined } from '@mui/icons-material';

const TrashNotes = () => {

    const { deletedNotes, setDeletedNotes } = useContext(DataContext);

    const deleteNote = () => {
        setDeletedNotes([]);
    }

    return (
        <React.Fragment>
            {
                deletedNotes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '5rem',
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
                ) :
                    (
                        <Container maxWidth="lg">
                            <Box mb={3}>
                                <Button sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    margin: 'auto',
                                    textTransform: "capitalize"
                                }} onClick={deleteNote} autoFocus>
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