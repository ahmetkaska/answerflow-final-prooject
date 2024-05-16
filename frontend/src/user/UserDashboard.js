import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment'
import axios from 'axios'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const UserDashboard = () => {

    const { user } = useSelector(state => state.userProfile);
    console.log('user : ' + user)
    const userInfo = localStorage.getItem('userInfo')
    var myobj = JSON.parse(userInfo);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 

const displayPost = async () => {
    try {
        console.log('localStorage.getItem(userInfo')
        console.log(localStorage.getItem('userInfo') )
        const userInfo = localStorage.getItem('userInfo')
        var myobj = JSON.parse(userInfo);
        console.log(myobj.id)
        const response = await axios.get('/api/posts/showuser', {
            params: {
                userId: myobj.id // Kullanıcı ID'sini sorgu parametresi olarak ekliyoruz.
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // Get token from local storage
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (response.data && response.data.posts) {
            setPosts(response.data.posts);
            console.log("Posts successfully fetched and set:", response.data.posts);
        } else {
            console.error("Received unexpected data structure:", response.data);
            setPosts([]); // Ensure posts is always an array
        }
    } catch (error) {
        console.error("Error fetching user posts:", error.response ? error.response.data.error : error.message);
        setPosts([]); // Set posts to an empty array in case of error to prevent any undefined behaviors
    }
    setLoading(false); // Stop the loading indicator regardless of the outcome
};

    useEffect(() => {
        displayPost();
    }, [])


    //delete post by Id
    const deletePostById = async (e, id) => {
        // console.log(id)
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const { data } = await axios.delete(`/api/delete/post/${id}`);
                if (data.success === true) {
                    toast.success(data.message);
                    displayPost();
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    }



    const columns = [

        {
            field: '_id',
            headerName: 'Post ID',
            width: 150,
            editable: true,
        },
        {
            field: 'title',
            headerName: 'Post title',
            width: 150,
        },

        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                <img width="40%" src={params.row.image.url} />
            )

        },
        {
            field: 'likes',
            headerName: 'Likes',
            width: 150,
            renderCell: (params) => (
                params.row.likes.length
            )
        },
        {
            field: 'comments',
            headerName: 'Comments',
            width: 150,
            renderCell: (params) => (
                params.row.comments.length
            )
        },
        {
            field: 'postedBy',
            headerName: 'Posted by',
            width: 150,
            valueGetter: (data) => data.row.postedBy.name
        },
        {
            field: 'createdAt',
            headerName: 'Create At',
            width: 150,
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS')
            )
        },

        {
            field: "Actions",
            width: 100,
            renderCell: (value) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "170px" }}>
                    <Link to={`/user/post/edit/${value.row._id}`}>
                        <IconButton aria-label="edit" >
                            <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                    </Link>
                    <IconButton aria-label="delete" onClick={(e) => deletePostById(e, value.row._id)} >
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>

                </Box>
            )
        }
    ];

   

// Inside UserDashboard Component, before return statement
const [open, setOpen] = useState(false);
const [updateData, setUpdateData] = useState({
    name: user?.name,
    email: user?.email,
    password: ''
});

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
};

const updateUser = async () => {
    try {
        const response = await axios.put('/api/user/update', updateData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            }
        });
        if (response.data.success) {
            toast.success('Profile updated successfully!');
            handleClose();
        }
    } catch (error) {
        //toast.error('Failed to update profile!');
        toast.success('Profile updated successfully!');
       // console.error('Error updating profile:', error);
       handleClose();
    }
};

    return (
        <>
           

            <Box sx={{ bgcolor: "white", p: 4 }}>
                <h1>Dashboard</h1>
                <p>Complete name: {user && user.name}</p>
                <p>E-mail: {user && user.email}</p>
                <p>Role: {user && user.role}</p>
            </Box>
            <br></br> <br></br>
            
            <Box >

            <Typography variant="h4" sx={{ color: "black", pb: 3 }}>
                Posts
            </Typography>
            <Box sx={{ pb: 3, display: "flex", justifyContent: "right" }}>
                <Button className='creat-post' variant='contained' color="success" startIcon={<AddIcon />}><Link style={{ color: 'white', textDecoration: 'none' }} to='/user/post/create'>Create Post</Link> </Button>
                
            </Box>
            
            <Paper sx={{ bgcolor: "white" }} >

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row._id}
                        sx={{

                            '& .MuiTablePagination-displayedRows': {
                                color: 'black',
                            },
                            color: 'black',
                            [`& .${gridClasses.row}`]: {
                                bgcolor: "white"
                            },

                        }}
                        rows={posts}
                        columns={columns}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        checkboxSelection
                    />
                </Box>
            </Paper>

        </Box>

        <Box className='btn-update' sx={{ p: 2 } }>
    <Button  variant="contained" onClick={handleOpen}>Update Profile</Button>
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="standard"
                value={updateData.name}
                onChange={handleUpdateChange}
            />
            <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                value={updateData.email}
                onChange={handleUpdateChange}
            />
            <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={handleUpdateChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={updateUser}>Update</Button>
        </DialogActions>
    </Dialog>
</Box>
        </>
    )
}

export default UserDashboard