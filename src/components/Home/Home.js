import * as React from "react";
import {
    Box,
    Container,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
} from "@mui/material";
import { red } from "@mui/material/colors";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import CommentIcon from "@mui/icons-material/Comment";

import FavoriteIcon from "@mui/icons-material/Favorite";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import { getAllPosts } from "../../services/get-posts";
import {
    likePost,
    dislikePost,
    updateEmoji,
    addComment,
} from "../../services/create-post";
import { SERVER_URI, DEV_SERVER_URI } from "../../services";

const SORT = [
    {
        value: "upVotes",
        label: "Up Votes",
    },
    {
        value: "downVotes",
        label: "Down Votes",
    },
];

const Home = () => {
    const [postsData, setPostsData] = React.useState([]);
    const [updateData, setUpdateData] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState({});
    const [sortBy, setSortBy] = React.useState("upVotes");

    const scroll = "paper";

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

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllPosts();
            const sorted = customSort(response);
            setPostsData(sorted);
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllPosts();
            const sorted = customSort(response);
            setUpdateData(false);
            setPostsData(sorted);
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

    const like = async (post) => {
        await likePost(post.id, post.votes.upVote + 1);
        setUpdateData(true);
    };

    const dislike = async (post) => {
        await dislikePost(post.id, post.votes.downVote + 1);
        setUpdateData(true);
    };

    const emoji = async (post, type) => {
        let data = { ...post.emojis };
        const { favorites, celebrate, sad } = data;
        if (type === "favorites") data = { ...data, favorites: favorites + 1 };
        else if (type === "celebrate")
            data = { ...data, celebrate: celebrate + 1 };
        else if (type === "sad") data = { ...data, sad: sad + 1 };
        await updateEmoji(post.id, data);
        setUpdateData(true);
    };

    return (
        <Box sx={{ my: 1 }}>
            <Container>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    sx={{ maxWidth: 800, margin: "16px auto" }}
                >
                    <TextField
                        id="sortBy"
                        select
                        label="Sort By"
                        value={sortBy}
                        onChange={handleSortBy}
                    >
                        {SORT.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                {postsData.map((post) => {
                    const imageURL = `${SERVER_URI}/getFile/${post.filename}`;
                    return (
                        <Card
                            key={post.id}
                            sx={{ maxWidth: 800, margin: "16px auto" }}
                        >
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
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        {post.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {post.content}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions disableSpacing>
                                <Grid container spacing={1}>
                                    <Grid item md={4}>
                                        <Box>
                                            <IconButton
                                                aria-label="like"
                                                size="small"
                                                onClick={() => like(post)}
                                            >
                                                <ThumbUpIcon fontSize="inherit" />
                                            </IconButton>
                                            {post.votes.upVote}
                                            <IconButton
                                                aria-label="dislike"
                                                size="small"
                                                onClick={() => dislike(post)}
                                            >
                                                <ThumbDownIcon fontSize="inherit" />
                                            </IconButton>
                                            {post.votes.downVote}
                                        </Box>
                                    </Grid>

                                    <Grid item md={2}>
                                        <Box>
                                            <IconButton
                                                aria-label="like"
                                                size="small"
                                                onClick={() =>
                                                    handleClickOpen(post)
                                                }
                                            >
                                                <CommentIcon fontSize="inherit" />
                                            </IconButton>
                                            {post.comments.length}
                                        </Box>
                                    </Grid>

                                    <Grid item sm={6}>
                                        <Box>
                                            <IconButton
                                                aria-label="favorites"
                                                size="small"
                                                onClick={() =>
                                                    emoji(post, "favorites")
                                                }
                                            >
                                                <FavoriteIcon fontSize="inherit" />
                                            </IconButton>
                                            {post.emojis.favorites}
                                            <IconButton
                                                aria-label="celebrate"
                                                size="small"
                                                onClick={() =>
                                                    emoji(post, "celebrate")
                                                }
                                            >
                                                <CelebrationIcon fontSize="inherit" />
                                            </IconButton>
                                            {post.emojis.celebrate}
                                            <IconButton
                                                aria-label="sad"
                                                size="small"
                                                onClick={() =>
                                                    emoji(post, "sad")
                                                }
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
                })}
                {open && (
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        scroll={scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogTitle id="scroll-dialog-title">
                            Comments
                        </DialogTitle>
                        <DialogContent dividers={scroll === "paper"}>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleAddComment}
                            >
                                <Grid container spacing={1}>
                                    <Grid item sm={12}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="username"
                                            name="username"
                                            label="UserName"
                                            type="username"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="comment"
                                            name="comment"
                                            label="Comment"
                                            type="comment"
                                            fullWidth
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ my: 2 }}>
                                <Divider />
                            </Box>
                            <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRef}
                                tabIndex={-1}
                            >
                                {selectedPost.comments.map((comment) => (
                                    <List
                                        sx={{
                                            width: "100%",
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={comment.username}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={comment.username}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {comment.comment}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.secondary"
                                                            display="flex"
                                                            justifyContent="flex-end"
                                                        >
                                                            {formatDate(
                                                                comment.createdAt
                                                            )}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider
                                            variant="inset"
                                            component="li"
                                        />
                                    </List>
                                ))}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </Box>
    );
};

export default Home;
