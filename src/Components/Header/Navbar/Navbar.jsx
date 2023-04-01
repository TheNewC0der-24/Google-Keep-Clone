import React from 'react';

import { styled } from '@mui/material/styles';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import logo from '../../../assets/Images/google-keep-logo.png';

import { useLocation } from 'react-router-dom';

const Navbar = styled(AppBar)`
    z-index: ${props => props.theme.zIndex.drawer + 1};
    background-color: #fff;
    box-shadow: inset 0 -1px 0 0 #dadce0;
`;

const Heading = styled(Typography)`
    color : #5f6368;
    font-size: 22px;
    padding: 0 0 0 15px;
`;

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const Header = ({ handleDrawer, open }) => {

    const location = useLocation();
    const pathName = capitalize(location.pathname.substring(1));

    return (
        <Navbar open={open}>
            <Toolbar>
                <IconButton
                    onClick={handleDrawer}
                    edge="start"
                    sx={{ marginRight: 5 }}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {
                        pathName ? "" : <img src={logo} alt="logo" style={{ width: 30 }} />
                    }
                    <Heading>{pathName || 'Keep'}</Heading>
                </Box>
            </Toolbar>
        </Navbar>
    )
}

export default Header;