import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userLogoutAction } from '../redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import HouseIcon from '@mui/icons-material/House';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.signIn);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logOutUser = () => {
        dispatch(userLogoutAction());
        window.location.reload(true);
        setTimeout(() => {
            navigate('/');
        }, 500);
    };

    const renderAdminLinks = () => (
        <Box sx={{ flexGrow: 1, display: 'flex', marginLeft: 'auto' }} className='navbar-box'>
            <Typography className='menu-typography'
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}>
                <div className='menu-all-items'>
                    <Link to="/admin/home" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/admin/profile" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Profile
                    </Link>
                    <Link to="/admin/dashboard" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Dashboard
                    </Link>
                </div>
            </Typography>
        </Box>
    );

    const renderUserLinks = () => (
        <Box sx={{ flexGrow: 1, display: 'flex', marginLeft: 'auto' }} className='navbar-box'>
            <Typography className='menu-typography'
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', mr: 2 }}>
                <div className='menu-all-items'>
                    <Link to="/user/home" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/user/profile" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Profile
                    </Link>
                    <Link to="/user/dashboard" className='navbar-menu-items' style={{ color: 'white', textDecoration: "none" }}>
                        Dashboard
                    </Link>
                </div>
            </Typography>
        </Box>
    );

    return (
        <AppBar position="static">
            <Container>
                <Toolbar disableGutters>
                    <HouseIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ANSWER-FLOW
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem key="Home" onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Home</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Display links based on user role */}
                    {userInfo?.role === 'admin' ? renderAdminLinks() : renderUserLinks()}

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                           
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center"><Link style={{ textDecoration: "none" }} to="/register">Register </Link></Typography>
                            </MenuItem>
                            {
                                userInfo ?
                                    <MenuItem onClick={logOutUser}>
                                        <Typography textAlign="center" color='#8e67b2'>Log Out </Typography>
                                    </MenuItem>
                                    :
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center"><Link style={{ textDecoration: "none" }} to="/login">Login </Link></Typography>
                                    </MenuItem>
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
