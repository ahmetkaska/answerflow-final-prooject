import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Divider } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import moment from 'moment';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const socket = io('/', {
    reconnection: true
});

const CommentList = ({ commentId, userId, name, text, onDelete, onEdit }) => {
    const { userInfo } = useSelector(state => state.signIn);
    const [open, setOpen] = useState(false);
    const [editText, setEditText] = useState(text);
    const firstLetter = name ? name.charAt(0) : '';

    const handleEditOpen = () => {
        setOpen(true);
    };

    const handleEditClose = () => {
        setOpen(false);
    };

    const handleEditChange = (e) => {
        setEditText(e.target.value);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(`/api/edit/comment/${commentId}`, { text: editText }, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            console.log(response.data.message);
            toast.success('Comment updated successfully!');
            onEdit({ _id: commentId, text: editText, postedBy: { _id: userId, name } });
            handleEditClose();
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/delete/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            console.log(response.data.message);

            if (onDelete) {
                onDelete(commentId);
            }

            toast.success('Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment.');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Avatar sx={{ bgcolor: red[500], marginRight: '10px' }}>
                {firstLetter.toUpperCase()}
            </Avatar>
            <div>
                <strong><h3 className='comment-user-name'>{name}</h3></strong>
                <p>{text}</p>
            </div>
            {userInfo && userInfo.id === userId && (
                <div className='div-edit-delete'>
                    <IconButton edge="end" aria-label="edit" onClick={handleEditOpen}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}

            <Dialog open={open} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Comment</DialogTitle>
                <DialogContent>
                    <Box sx={{ minWidth: 500 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="editText"
                            label="Edit Comment"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={editText}
                            onChange={handleEditChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const SinglePost = () => {
    const { userInfo } = useSelector(state => state.signIn);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsRealTime, setCommentsRealTime] = useState([]);

    const { id } = useParams();

    const displaySinglePost = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/post/${id}`);
            setTitle(data.post.title);
            setContent(data.post.content);
            setImage(data.post.image.url);
            setCreatedAt(data.post.createdAt);
            setLoading(false);
            setComments(data.post.comments);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        displaySinglePost();

        socket.on('new-comment', newComment => {
            setComments(prev => [...prev, newComment]);
        });

        socket.on('update-comment', updatedComment => {
            setComments(prev =>
                prev.map(comment => (comment._id === updatedComment._id ? updatedComment : comment))
            );
        });

        // Clean up the effect
        return () => {
            socket.off('new-comment');
            socket.off('update-comment');
        };
    }, [id]);

    useEffect(() => {
        socket.on('new-comment', newComment => {
            setCommentsRealTime(newComment);
        });
    }, []);

    const addComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/comment/post/${id}`, { comment });
            if (data.success === true) {
                setComment('');
                toast.success("Comment added");
                socket.emit('comment', data.post.comments);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.toString());
        }
    };

    const handleDeleteComment = (deletedCommentId) => {
        setComments(comments.filter(comment => comment._id !== deletedCommentId));
    };

    const handleEditSubmit = (editedComment) => {
        setComments(comments.map(comment =>
            comment._id === editedComment._id ? editedComment : comment
        ));
        socket.emit('update-comment', editedComment);
    };

    let uiCommentUpdate = commentsRealTime.length > 0 ? commentsRealTime : comments;

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#f5f5f5", display: 'flex', justifyContent: 'center', pt: 4, pb: 4, minHeight: "100vh" }}>
                {loading ? <Loader /> :
                    <>
                        <Card sx={{ width: '40%', maxWidth: 1200, height: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {title ? title.charAt(0).toUpperCase() : ''}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={<Typography variant="h4">{title}</Typography>}
                                subheader={moment(createdAt).format('MMMM DD, YYYY')}
                            />
                            <CardMedia
                                component="img"
                                height="50%"
                                image={image}
                                alt={title}
                            />
                            <CardContent>
                                <Typography variant="body1" color="text.secondary">
                                    <Box component='span' dangerouslySetInnerHTML={{ __html: content }}></Box>
                                </Typography>
                                <Divider variant="inset" />
                                {comments.length === 0 ? '' :
                                    <Typography variant='h5' sx={{ pt: 3, mb: 2 }}>
                                        Answers:
                                    </Typography>
                                }
                                {uiCommentUpdate && uiCommentUpdate.length > 0 && uiCommentUpdate.map(comment => (
                                    comment.postedBy ? (
                                        <CommentList
                                            key={comment._id}
                                            commentId={comment._id}
                                            userId={comment.postedBy._id}
                                            name={comment.postedBy.name}
                                            text={comment.text}
                                            onDelete={handleDeleteComment}
                                            onEdit={handleEditSubmit}
                                        />
                                    ) : null
                                ))}
                                {userInfo ?
                                    <>
                                        <Box sx={{ pt: 2, pl: 3, pb: 3, bgcolor: "#f5f5f5" }}>
                                            <h2>Add your answer here!</h2>
                                            <form onSubmit={addComment}>
                                                <TextareaAutosize
                                                    className='textarea'
                                                    onChange={(e) => setComment(e.target.value)}
                                                    value={comment}
                                                    aria-label="minimum height"
                                                    minRows={3}
                                                    placeholder="Add an answer..."
                                                    style={{ width: '400px', padding: "10px" }}
                                                />
                                                <Box sx={{ pt: 2 }}>
                                                    <Button type='submit' variant='contained'>Cevap</Button>
                                                </Box>
                                            </form>
                                        </Box>
                                    </>
                                    : <Link to='/login'>Cevap Eklemek İçin Lütfen Giriş Yapınız.</Link>
                                }
                            </CardContent>
                        </Card>
                    </>
                }
            </Box>
        </>
    );
};

export default SinglePost;
