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

const Navbar = styled(AppBar)`
    z-index: ${props => props.theme.zIndex.drawer + 1};
    background-color: #fff;
    height: 70px;
    box-shadow: inset 0 -1px 0 0 #dadce0;
`;

const Heading = styled(Typography)`
    color : #5f6368;
    font-size: 22px;
    padding: 0 0 0 15px;
`;

const Header = ({ handleDrawer, open }) => {

    const logo = 'https://seeklogo.com/images/G/google-keep-logo-0BC92EBBBD-seeklogo.com.png';

    return (
        <div>
            <Navbar open={open}>
                <Toolbar>
                    <IconButton
                        onClick={handleDrawer}
                        edge="start"
                        sx={{ marginRight: 5 }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={logo} alt="logo" style={{ width: 30 }} />
                        <Heading>Keep</Heading>
                    </Box>
                </Toolbar>
            </Navbar>
        </div>
    )
}

export default Header;