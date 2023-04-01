import React, { useContext } from 'react';

import Form from './Form';
import Note from './Note';

import { DataContext } from '../../Context/DataProvider';

import { Box, Typography, Grid } from '@mui/material';

import { LightbulbOutlined } from '@mui/icons-material';


const Notes = () => {

    const { notes } = useContext(DataContext);

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
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                            Notes you add appear here
                        </Typography>
                    </Box>
                ) :
                    (
                        <Grid spacing={2} container>
                            {
                                notes.map(note => (
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Note note={note} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    )
            }
        </React.Fragment>
    )
}

export default Notes;