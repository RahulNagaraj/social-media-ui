import React from "react";
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
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

import { formatDate } from "../../common/utils";
import { SERVER_URI } from "../../services";

const Post = ({
    post,
    handleLike,
    handleDislike,
    handleEmoji,
    handleClickOpen,
}) => {
    const imageURL = `${SERVER_URI}/getFile/${post.filename}`;
    return (
        <Card key={post.id} sx={{ maxWidth: 800, margin: "16px auto" }}>
            <CardActionArea>
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="username"
                        >
                            {post.username[0].toUpperCase()}
                        </Avatar>
                    }
                    title={post.username}
                    subheader={formatDate(post.createdAt)}
                />
                {post.type !== "text" && (
                    <CardMedia
                        component="img"
                        height="250"
                        image={imageURL}
                        alt="img"
                    />
                )}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.content}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions disableSpacing>
                <Grid container spacing={1}>
                    <Grid item md={4} display="flex" justifyContent="center">
                        <Box>
                            <IconButton
                                aria-label="like"
                                size="small"
                                onClick={() => handleLike(post)}
                            >
                                <ThumbUpIcon fontSize="inherit" />
                            </IconButton>
                            {post.votes.upVote}
                            <IconButton
                                aria-label="dislike"
                                size="small"
                                onClick={() => handleDislike(post)}
                            >
                                <ThumbDownIcon fontSize="inherit" />
                            </IconButton>
                            {post.votes.downVote}
                        </Box>
                    </Grid>

                    <Grid item md={2} display="flex" justifyContent="center">
                        <Box>
                            <IconButton
                                aria-label="like"
                                size="small"
                                onClick={() => handleClickOpen(post)}
                            >
                                <CommentIcon fontSize="inherit" />
                            </IconButton>
                            {post.comments.length}
                        </Box>
                    </Grid>

                    <Grid item sm={6} display="flex" justifyContent="center">
                        <Box>
                            <IconButton
                                aria-label="favorites"
                                size="small"
                                onClick={() => handleEmoji(post, "favorites")}
                            >
                                <FavoriteIcon fontSize="inherit" />
                            </IconButton>
                            {post.emojis.favorites}
                            <IconButton
                                aria-label="celebrate"
                                size="small"
                                onClick={() => handleEmoji(post, "celebrate")}
                            >
                                <CelebrationIcon fontSize="inherit" />
                            </IconButton>
                            {post.emojis.celebrate}
                            <IconButton
                                aria-label="sad"
                                size="small"
                                onClick={() => handleEmoji(post, "sad")}
                            >
                                <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                            </IconButton>
                            {post.emojis.sad}
                        </Box>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
};

export default Post;
