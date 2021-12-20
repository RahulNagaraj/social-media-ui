import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Alert,
    Snackbar,
} from "@mui/material";
import { createPost, uploadFile } from "../../services/create-post";

const Create = () => {
    const navigate = useNavigate();
    const [filename, setFilename] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("");

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleFileChange = async (event) => {
        const files = event.target.files[0];
        const formData = new FormData();
        formData.append("file", files);
        const response = await uploadFile(formData);
        if (response.status === "OK") {
            setFilename(response.filename);
            setMessage("Successfully uploaded image!");
            setSeverity("success");
            handleClick();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get("title");
        const username = data.get("username");
        const content = data.get("content");
        if (!title || !username || !content) {
            setMessage("Please fill required fields");
            setSeverity("error");
            handleClick();
            return;
        }
        const media = data.get("media");
        const formData = new FormData();
        formData.append("file", media);
        const post = {
            id: `post:${new Date().getTime()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: media.name !== "" ? "media" : "text",
            username,
            title,
            content,
            votes: { upVote: 0, downVote: 0 },
            filename,
            comments: [],
            emojis: { favorites: 0, celebrate: 0, sad: 0 },
        };
        const response = await createPost(post);
        if (response === "OK") {
            navigate("/");
        } else {
            return <Alert severity="error">Error creating a Post</Alert>;
        }
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
                                    accept: "image/*",
                                }}
                                id="media"
                                onChange={handleFileChange}
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
            {open && (
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={severity}
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default Create;
