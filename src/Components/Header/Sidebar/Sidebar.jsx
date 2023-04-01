import * as React from 'react';

import { styled } from '@mui/material/styles';

import { Box, Link, Drawer as MuiDrawer, Typography } from '@mui/material';

import Navbar from '../Navbar/Navbar';
import NavList from './NavList';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    marginTop: 10,
    border: 'none'
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    marginTop: 10,
    border: 'none'
});

const DrawerHeader = styled('div')(({ theme }) => ({
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        })
    }),
);

const Sidebar = () => {
    const [open, setOpen] = React.useState(false);

    const handleDrawer = () => {
        setOpen(prevState => !prevState);
    };

    return (
        <Box sx={{ display: 'flex' }}>

            <Navbar open={open} handleDrawer={handleDrawer} />

            <Drawer variant="permanent" open={open}>
                <DrawerHeader></DrawerHeader>
                <NavList open={open} setOpen={setOpen} />

                {open && (
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Created by: <Link underline='hover' href="https://github.com/TheNewC0der-24" target="_blank" rel="noopener noreferrer">Bhavya Khurana</Link>
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
}

export default Sidebar;