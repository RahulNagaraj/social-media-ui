import React from "react";
import {
    Box,
    Avatar,
    Typography,
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
} from "@mui/material";

import { formatDate } from "../../common/utils";

const Comments = ({ open, handleClose, selectedPost, handleAddComment }) => {
    const scroll = "paper";
    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="comments-title"
            aria-describedby="comments-description"
        >
            <DialogTitle id="comments-title">Comments</DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
                <Box component="form" noValidate onSubmit={handleAddComment}>
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
                            <Button type="submit" fullWidth variant="contained">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ my: 2 }}>
                    <Divider />
                </Box>
                <DialogContentText
                    id="comments-description"
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
                                    <Avatar alt={comment.username} />
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
                                                {formatDate(comment.createdAt)}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </List>
                    ))}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Comments;
