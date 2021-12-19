import * as React from "react";
import { Container, Box, Grid, TextField, Button } from "@mui/material";
import { createPost } from "../../services/create-post";

const Create = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const media = data.get("media");
        const post = {
            id: `post:${new Date().getTime()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: media.name !== "" ? "media" : "text",
            username: data.get("username"),
            title: data.get("title"),
            content: data.get("content"),
            votes: { upVote: 0, downVote: 0 },
            comments: [],
            emojis: { favorites: 0, celebrate: 0, sad: 0 },
        };
        const response = await createPost(post);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                name="title"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="content"
                                label="Content"
                                multiline
                                rows={4}
                                id="content"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="media"
                                type="file"
                                inputProps={{
                                    accept: "image/*, video/*",
                                }}
                                id="media"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Post
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Create;
