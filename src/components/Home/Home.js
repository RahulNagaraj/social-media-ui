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

    const handleClickOpen = (key) => {
        setOpen(true);
        setSelectedPost(postsData[key]);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSortBy = (e) => {
        const value = e.target.value;
        setSortBy(value);
        const newArr = [...postsData];
        let sorted = [];
        if (value === "upVotes") {
            sorted = newArr.sort(function (a, b) {
                return b.votes.upVote - a.votes.upVote;
            });
        } else {
            sorted = newArr.sort(function (a, b) {
                return b.votes.downVote - a.votes.downVote;
            });
        }

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
        await updateEmoji(postsData[key].id, data);
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
                {Object.keys(postsData).map((key) => {
                    const imageURL = `${SERVER_URI}/getFile/${postsData[key].filename}`;
                    return (
                        <>
                            <Card
                                key={key}
                                sx={{ maxWidth: 800, margin: "16px auto" }}
                            >
                                <CardActionArea>
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                sx={{ bgcolor: red[500] }}
                                                aria-label="username"
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
                                    {postsData[key].type !== "text" && (
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
                                        <Grid item md={4}>
                                            <Box>
                                                <IconButton
                                                    aria-label="like"
                                                    size="small"
                                                    onClick={() => like(key)}
                                                >
                                                    <ThumbUpIcon fontSize="inherit" />
                                                </IconButton>
                                                {postsData[key].votes.upVote}
                                                <IconButton
                                                    aria-label="dislike"
                                                    size="small"
                                                    onClick={() => dislike(key)}
                                                >
                                                    <ThumbDownIcon fontSize="inherit" />
                                                </IconButton>
                                                {postsData[key].votes.downVote}
                                            </Box>
                                        </Grid>

                                        <Grid item md={2}>
                                            <Box>
                                                <IconButton
                                                    aria-label="like"
                                                    size="small"
                                                    onClick={() =>
                                                        handleClickOpen(key)
                                                    }
                                                >
                                                    <CommentIcon fontSize="inherit" />
                                                </IconButton>
                                                {postsData[key].comments.length}
                                            </Box>
                                        </Grid>

                                        <Grid item sm={6}>
                                            <Box>
                                                <IconButton
                                                    aria-label="favorites"
                                                    size="small"
                                                    onClick={() =>
                                                        emoji(key, "favorites")
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
                                                    size="small"
                                                    onClick={() =>
                                                        emoji(key, "celebrate")
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
                                                    size="small"
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
                        </>
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
