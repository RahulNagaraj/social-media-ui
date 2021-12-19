import * as React from "react";
import {
    Box,
    Container,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    CardActionArea,
    Grid,
} from "@mui/material";
import { red } from "@mui/material/colors";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import CommentIcon from "@mui/icons-material/Comment";

import FavoriteIcon from "@mui/icons-material/Favorite";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import { getAllPosts } from "../../services/get-posts";
import { likePost, dislikePost, updateEmoji } from "../../services/create-post";

const Home = () => {
    const [postsData, setPostsData] = React.useState({});
    const [updateData, setUpdateData] = React.useState(false);
    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllPosts();
            setPostsData(response);
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllPosts();
            setUpdateData(false);
            setPostsData(response);
        }
        if (updateData) {
            fetchData();
        }
    }, [updateData]);

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    };

    const like = async (key) => {
        await likePost(postsData[key].id, postsData[key].votes.upVote + 1);
        setUpdateData(true);
    };

    const dislike = async (key) => {
        await dislikePost(postsData[key].id, postsData[key].votes.downVote + 1);
        setUpdateData(true);
    };

    const emoji = async (key, type) => {
        let data = { ...postsData[key].emojis };
        const { favorites, celebrate, sad } = data;
        if (type === "favorites") data = { ...data, favorites: favorites + 1 };
        else if (type === "celebrate")
            data = { ...data, celebrate: celebrate + 1 };
        else if (type === "sad") data = { ...data, sad: sad + 1 };
        console.log(data);
        await updateEmoji(postsData[key].id, data);
        setUpdateData(true);
    };

    return (
        <Box>
            <Container sx={{ my: 1 }}>
                <Grid container spacing={1}>
                    {Object.keys(postsData).map((key) => {
                        return (
                            <Grid key={key} item sm={4}>
                                <Card key={key} sx={{ maxWidth: 345, my: 1 }}>
                                    <CardActionArea>
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    sx={{ bgcolor: red[500] }}
                                                    aria-label="recipe"
                                                >
                                                    {postsData[
                                                        key
                                                    ].username[0].toUpperCase()}
                                                </Avatar>
                                            }
                                            title={postsData[key].username}
                                            subheader={formatDate(
                                                postsData[key].createdAt
                                            )}
                                        />

                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                            >
                                                {postsData[key].title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {postsData[key].content}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions disableSpacing>
                                        <Grid container spacing={1}>
                                            <Grid item md={6}>
                                                <Box>
                                                    <IconButton
                                                        aria-label="like"
                                                        onClick={() =>
                                                            like(key)
                                                        }
                                                    >
                                                        <ThumbUpIcon fontSize="inherit" />
                                                    </IconButton>
                                                    {
                                                        postsData[key].votes
                                                            .upVote
                                                    }
                                                    <IconButton
                                                        aria-label="dislike"
                                                        onClick={() =>
                                                            dislike(key)
                                                        }
                                                    >
                                                        <ThumbDownIcon fontSize="inherit" />
                                                    </IconButton>
                                                    {
                                                        postsData[key].votes
                                                            .downVote
                                                    }
                                                </Box>
                                            </Grid>

                                            <Grid item sm={6}>
                                                <Box>
                                                    <IconButton
                                                        aria-label="favorites"
                                                        onClick={() =>
                                                            emoji(
                                                                key,
                                                                "favorites"
                                                            )
                                                        }
                                                    >
                                                        <FavoriteIcon fontSize="inherit" />
                                                    </IconButton>
                                                    {
                                                        postsData[key].emojis
                                                            .favorites
                                                    }
                                                    <IconButton
                                                        aria-label="celebrate"
                                                        onClick={() =>
                                                            emoji(
                                                                key,
                                                                "celebrate"
                                                            )
                                                        }
                                                    >
                                                        <CelebrationIcon fontSize="inherit" />
                                                    </IconButton>
                                                    {
                                                        postsData[key].emojis
                                                            .celebrate
                                                    }
                                                    <IconButton
                                                        aria-label="sad"
                                                        onClick={() =>
                                                            emoji(key, "sad")
                                                        }
                                                    >
                                                        <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                                                    </IconButton>
                                                    {postsData[key].emojis.sad}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
