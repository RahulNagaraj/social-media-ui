import * as React from "react";
import { Box, Container, CircularProgress } from "@mui/material";

import { getAllPosts } from "../../services/get-posts";
import {
    likePost,
    dislikePost,
    updateEmoji,
    addComment,
} from "../../services/create-post";
import Post from "./Post";
import Comments from "./Comments";
import SortBy from "./SortBy";

const Home = () => {
    const [postsData, setPostsData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [updateData, setUpdateData] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState({});
    const [sortBy, setSortBy] = React.useState("upVotes");

    const handleClickOpen = (post) => {
        setOpen(true);
        setSelectedPost(post);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const customSort = (unsorted, sortBy = "upVotes") => {
        const newArr = [...unsorted];
        let sorted = [];
        if (sortBy === "upVotes") {
            sorted = newArr.sort(function (a, b) {
                return b.votes.upVote - a.votes.upVote;
            });
        } else {
            sorted = newArr.sort(function (a, b) {
                return b.votes.downVote - a.votes.downVote;
            });
        }

        return sorted;
    };

    const handleSortBy = (e) => {
        const value = e.target.value;
        setSortBy(value);
        const sorted = customSort(postsData, value);

        setPostsData(sorted);
    };

    React.useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await getAllPosts();
            const sorted = customSort(response);
            setPostsData(sorted);
            setLoading(false);
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await getAllPosts();
            const sorted = customSort(response);
            setUpdateData(false);
            setPostsData(sorted);
            setLoading(false);
        }
        if (updateData) {
            fetchData();
        }
    }, [updateData]);

    const handleAddComment = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const comment = {
            username: data.get("username"),
            comment: data.get("comment"),
            createdAt: new Date(),
        };
        await addComment(selectedPost.id, comment);
        handleClose();
        setUpdateData(true);
    };

    const handleLike = async (post) => {
        await likePost(post.id, post.votes.upVote + 1);
        setUpdateData(true);
    };

    const handleDislike = async (post) => {
        await dislikePost(post.id, post.votes.downVote + 1);
        setUpdateData(true);
    };

    const handleEmoji = async (post, type) => {
        let data = { ...post.emojis };
        const { favorites, celebrate, sad } = data;
        if (type === "favorites") data = { ...data, favorites: favorites + 1 };
        else if (type === "celebrate")
            data = { ...data, celebrate: celebrate + 1 };
        else if (type === "sad") data = { ...data, sad: sad + 1 };
        await updateEmoji(post.id, data);
        setUpdateData(true);
    };

    // if (loading) {
    //     return (
    //         <Box sx={{ display: "flex" }}>
    //             <Container>
    //                 <CircularProgress />
    //             </Container>
    //         </Box>
    //     );
    // }

    return (
        <Box sx={{ my: 1 }}>
            <Container>
                <SortBy sortBy={sortBy} handleSortBy={handleSortBy} />
                {postsData.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                        handleEmoji={handleEmoji}
                        handleClickOpen={handleClickOpen}
                    />
                ))}
                {open && (
                    <Comments
                        open={open}
                        handleClose={handleClose}
                        handleAddComment={handleAddComment}
                        selectedPost={selectedPost}
                    />
                )}
            </Container>
        </Box>
    );
};

export default Home;
