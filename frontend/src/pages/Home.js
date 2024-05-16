import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';
import '../components/css/searchEngineHome.css';

const socket = io('/', {
    reconnection: true
});

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [postAddLike, setPostAddLike] = useState([]);
    const [postRemoveLike, setPostRemoveLike] = useState([]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            let filteredPosts = [];
            if (query.trim() !== '') {
                filteredPosts = posts.filter(post => post.content.toLowerCase().includes(query.toLowerCase()));
            } else {
                const { data } = await axios.get('/api/posts/show');
                filteredPosts = data.posts;
            }
            setPosts(filteredPosts);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.error);
            setLoading(false);
        }
    };

    const handleTagSearch = async (tag) => {
        setLoading(true);
        try {
            let filteredPosts = [];
            if (tag.trim() !== '') {
                filteredPosts = posts.filter(post => post.content.toLowerCase().includes(tag.toLowerCase()));
            } else {
                const { data } = await axios.get('/api/posts/show');
                filteredPosts = data.posts;
            }
            setPosts(filteredPosts);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.error);
            setLoading(false);
        }
    };

    const showPosts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/posts/show');
            setPosts(data.posts);
            setLoading(false);
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    useEffect(() => {
        showPosts();
        const addLikeListener = (newPosts) => {
            setPosts(newPosts);
        };
        const removeLikeListener = (newPosts) => {
            setPosts(newPosts);
        };

        socket.on('add-like', addLikeListener);
        socket.on('remove-like', removeLikeListener);

        return () => {
            socket.off('add-like', addLikeListener);
            socket.off('remove-like', removeLikeListener);
        };
    }, []);

    let uiPosts = postAddLike.length > 0 ? postAddLike : postRemoveLike.length > 0 ? postRemoveLike : posts;

    return (
        <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
            <Navbar />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <div className="search-container1">
                    <input
                        type="text"
                        placeholder="Soru Ara..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        className="search-input1"
                    />
                    <button onClick={handleSearch} className="search-button1">Soru Ara</button>
                </div>
            </Box>
            <Container sx={{ pt: 5, pb: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        {loading ? <Loader /> :
                            posts.length > 0 ? posts.map((post, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <PostCard
                                        id={post._id}
                                        title={post.title}
                                        content={post.content}
                                        image={post.image ? post.image.url : ''}
                                        subheader={moment(post.createdAt).format('MMMM DD, YYYY')}
                                        comments={post.comments.length}
                                        likes={post.likes.length}
                                        likesId={post.likes}
                                        showPosts={showPosts}
                                        onTagClick={handleTagSearch}
                                    />
                                </Grid>
                            )) : <p>No posts found.</p>
                        }
                    </Grid>
                </Box>
            </Container>
          
        </Box>
    );
};

export default Home;
