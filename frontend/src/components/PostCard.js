import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PostCard = ({
    id,
    title,
    content,
    image,
    subheader,
    comments,
    likes,
    likesId,
    showPosts,
    onTagClick
}) => {
    const { userInfo } = useSelector(state => state.signIn);

    function extractHashTags(text) {
        const hashTagPattern = /#([\wğüşöçıİĞÜŞÖÇ]+)/g;
        let match;
        let result = [];

        while ((match = hashTagPattern.exec(text)) !== null) {
            result.push(match[0]);
        }

        return result;
    }

    const hashtags = extractHashTags(content);

    const addLike = async () => {
        try {
            await axios.put(`/api/addlike/post/${id}`);
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    const removeLike = async () => {
        try {
            await axios.put(`/api/removelike/post/${id}`);
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    const firstLetter = title ? title.charAt(0) : '';

    return (
        
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {firstLetter.toUpperCase()}
                    </Avatar>
                }
                title={title}
                subheader={subheader}
            />
            <Link to={`/post/${id}`}>
                <CardMedia
                    component="img"
                    height="194"
                    image={image}
                    alt={title}
                />
            </Link>
            <CardContent>
                {hashtags.map((tag, index) => (
                    <Link key={index} className='tags' onClick={() => onTagClick(tag)}>
                        {tag + ' '}
                    </Link>
                ))}
            </CardContent>
            <CardActions>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        {likesId.includes(userInfo && userInfo.id) ?
                            <IconButton onClick={removeLike} aria-label="remove like">
                                <FavoriteIcon sx={{ color: 'red' }} />
                            </IconButton>
                            :
                            <IconButton onClick={addLike} aria-label="add like">
                                <FavoriteBorderIcon />
                            </IconButton>
                        }
                        {likes} Like(s)
                    </Box>
                    <Box>
                        {comments}
                        <IconButton aria-label="comments">
                            <CommentIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardActions>
        </Card>
    );
}

export default PostCard;
