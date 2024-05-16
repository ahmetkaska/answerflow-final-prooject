// Profile.jsx

import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';
import SearchEngine from '../components/SearchEngine';
import '../components/css/searchEngineProfile.css';

const socket = io('/', { reconnection: true });

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const showPosts = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            const myobj = JSON.parse(userInfo);
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
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching user posts:", error.message);
            setPosts([]); // Set posts to an empty array in case of error to prevent any undefined behaviors
        }
        setLoading(false); // Stop the loading indicator regardless of the outcome
    };

    useEffect(() => {
        showPosts();
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query); // SearchEngine'den gelen sorguyu sakla
        try {
            const userInfo = localStorage.getItem('userInfo');
            const myobj = JSON.parse(userInfo);
            const response = await axios.get('/api/posts/showuser', {
                params: {
                    userId: myobj.id
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const filteredPosts = response.data.posts.filter(post =>
                post.content.toLowerCase().includes(query.toLowerCase())
            );
            setPosts(filteredPosts);
        } catch (error) {
            console.error("Error fetching user posts:", error.message);
            setPosts([]);
        }
        setLoading(false);
    };

    const handleTagSearch = async (tag) => {
        setLoading(true);
        try {
            const userInfo = localStorage.getItem('userInfo');
            const myobj = JSON.parse(userInfo);
            const response = await axios.get('/api/posts/showuser', {
                params: {
                    userId: myobj.id
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.data && response.data.posts) {
                const filteredPosts = response.data.posts.filter(post =>
                    post.content.toLowerCase().includes(tag.toLowerCase())
                );
                setPosts(filteredPosts);
            } else {
                console.error("Received unexpected data structure:", response.data);
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error.response ? error.response.data.error : error.message);
            setPosts([]);
        }
        setLoading(false);
    };

    return (
        <>
            <SearchEngine onSearch={handleSearch} />
            <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
                <Navbar />
                <Container sx={{ pt: 5, pb: 5, minHeight: "83vh" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {loading ? <Loader /> :
                                posts.length > 0 ? posts.map((post, index) => (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
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
        </>
    );
};

export default Profile;




/*
import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';
import SearchEngine from '../components/SearchEngine';
import '../components/css/searchEngineProfile.css';

const socket = io('/', { reconnection: true });

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

   
    const showPosts = async () => {
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
        showPosts();
        // Cleanup the socket when component unmounts
        return () => {
            socket.disconnect();
            console.log("Socket disconnected on cleanup");
        };
    }, []);
    useEffect(() => {
        showPosts();
        return () => {
            socket.disconnect();
            console.log("Socket disconnected on cleanup");
        };
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query); // SearchEngine'den gelen sorguyu sakla
        // Burada sorguyu kullanarak gönderileri filtreleyip yeniden yükle
        try {
            const userInfo = localStorage.getItem('userInfo');
            const myobj = JSON.parse(userInfo);
            const response = await axios.get('/api/posts/showuser', {
                params: {
                    userId: myobj.id
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.data && response.data.posts) {
                const filteredPosts = response.data.posts.filter(post =>
                    post.content.toLowerCase().includes(query.toLowerCase())
                );
                setPosts(filteredPosts);
            } else {
                console.error("Received unexpected data structure:", response.data);
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error.response ? error.response.data.error : error.message);
            setPosts([]);
        }
        setLoading(false);
    };

    return (
        <>
            <SearchEngine onSearch={handleSearch} />
            <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
                <Navbar />
                <Container sx={{ pt: 5, pb: 5, minHeight: "83vh" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {loading ? <Loader /> :
                                posts.length > 0 ? posts.map((post, index) => (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
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
                                        />
                                    </Grid>
                                )) : <p>No posts found.</p>
                            }
                        </Grid>
                    </Box>
                </Container>
                <Footer />
            </Box>
        </>
    );
};

export default Profile;

*/

/*

import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Box, Container, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import moment from 'moment';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';
import SearchEngine from '../components/SearchEngine';
import '../App.css';


// Consider initializing the socket in a context if it's used across multiple components
const socket = io('/', { reconnection: true });

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loading true to prevent flash of content

    const showPosts = async () => {
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
        showPosts();
        // Cleanup the socket when component unmounts
        return () => {
            socket.disconnect();
            console.log("Socket disconnected on cleanup");
        };
    }, []);

    return (
        <>
            <SearchEngine/>
            <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
                <Navbar />
                <Container sx={{ pt: 5, pb: 5, minHeight: "83vh" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {loading ? <Loader /> :
                                posts.length > 0 ? posts.map((post, index) => (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
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
                                        />
                                    </Grid>
                                )) : <p>No posts found.</p>
                            }
                        </Grid>
                    </Box>
                </Container>
                <Footer />
            </Box>
        </>
    );
};

export default Profile;
*/