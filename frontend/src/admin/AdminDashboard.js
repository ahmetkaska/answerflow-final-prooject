import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, IconButton } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.userProfile);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const displayPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/posts/show', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            setPosts(response.data.posts);
        } catch (error) {
            toast.error("Error fetching posts");
            setPosts([]);
        }
        setLoading(false);
    };

    const displayUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users/show', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            setUsers(response.data.users);
        } catch (error) {
            toast.error("Error fetching users");
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        displayPosts();
        displayUsers();
    }, []);

    const deletePostById = async (e, id) => {
        // console.log(id)
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const { data } = await axios.delete(`/api/delete/post/${id}`);
                if (data.success === true) {
                    toast.success(data.message);
                    displayPosts();
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    }

    const deleteUserById = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await axios.delete(`/api/users/delete/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.data.success) {
                    toast.success("User deleted successfully");
                    displayUsers();
                }
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

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
            width: 220,
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS')
            )
        },

        {
            field: "Actions",
            width: 100,
            renderCell: (value) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "170px" }}>
                    <Link to={`/admin/post/edit/${value.row._id}`}>
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

    const userColumns = [
        { field: 'name', headerName: 'Name', width: 400 },
        { field: 'email', headerName: 'Email', width: 400 },
        { field: 'role', headerName: 'Role', width: 380 },
        { field: 'actions', headerName: 'Actions', width: 300, renderCell: (params) => (
            <>
                <Link to={`/admin/updateUser/${params.id}`}>
                    <IconButton color="primary">
                        <EditIcon />
                    </IconButton>
                </Link>
                <IconButton onClick={() => deleteUserById(params.id)} sx ={{color:"red"}}>
                    <DeleteIcon />
                </IconButton>
                
            </>
        )}
    ];

    return (
        <Box>
            <Typography variant="h4">Dashboard</Typography>
            <br></br>
            <Paper sx={{ bgcolor: 'white', p: 4, mb: 3 }} >
                
                <Typography> <strong>Complete name: {user && user.name}</strong> </Typography>
                <br/>
                <Typography><strong>E-mail: {user && user.email}</strong></Typography>
                <br/>
                <Typography ><strong>Role: {user && user.role}</strong></Typography>
            </Paper>

            <Typography variant="h4" sx={{ color: "black", pb: 3 }}>
                Posts
            </Typography>
            <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
                <Button variant='contained' color="success" startIcon={<AddIcon />}><Link style={{ color: 'white', textDecoration: 'none' }} to='/admin/post/create'>Create Post</Link> </Button>
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

            <Typography variant="h4" sx={{ color: "black", pb: 3,  mt:2 }}>
                Users
            </Typography>
            <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}> 
            <Button variant='contained' color="success" startIcon={<AddIcon />}>
                <Link style={{ color: 'white', textDecoration: 'none' }} to='/admin/user/create'>Create User</Link>
            </Button>
            </Box>
            <Paper sx={{ mt: 0, p: 2 }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    sx={{ height: 400, '& .MuiDataGrid-cell': { color: 'black' } }}
                    rows={users}
                    columns={userColumns}
                    pageSize={5}
                    loading={loading}
                />
            </Paper>
        </Box>
    );
};

export default AdminDashboard;
