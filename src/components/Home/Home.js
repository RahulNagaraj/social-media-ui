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
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import { getAllPosts } from "../../services/get-posts";

const Home = () => {
    const [postsData, setPostsData] = React.useState({});
    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllPosts();
            setPostsData(response);
        }
        fetchData();
    }, []);
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
                                            subheader="September 14, 2016"
                                        />

                                        <CardContent>
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
                                                        size="large"
                                                    >
                                                        <ThumbUpIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="dislike"
                                                        size="large"
                                                    >
                                                        <ThumbDownIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Box>
                                            </Grid>

                                            <Grid item sm={6}>
                                                <Box>
                                                    <IconButton
                                                        aria-label="favorites"
                                                        size="large"
                                                    >
                                                        <FavoriteIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="celebrate"
                                                        size="large"
                                                    >
                                                        <CelebrationIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="sad"
                                                        size="large"
                                                    >
                                                        <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                                                    </IconButton>
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
