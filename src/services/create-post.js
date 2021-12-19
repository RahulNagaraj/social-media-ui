import API from ".";

export const createPost = async (post) => {
    try {
        const response = await API.post("/posts", post);
        return response.data;
    } catch (error) {
        console.error("Error creating a posts");
        return {};
    }
};

export const likePost = async (id, count) => {
    try {
        const uri = `/posts/${id}/likePost`;
        const data = { count };
        const response = await API.post(uri, data);
        return response.data;
    } catch (error) {
        console.error("Error while liking a posts");
        return {};
    }
};

export const dislikePost = async (id, count) => {
    try {
        const uri = `/posts/${id}/dislikePost`;
        const data = { count };
        const response = await API.post(uri, data);
        return response.data;
    } catch (error) {
        console.error("Error while disliking a posts");
        return {};
    }
};

export const updateEmoji = async (id, data) => {
    try {
        const uri = `/posts/${id}/emojis`;
        const response = await API.post(uri, data);
        return response.data;
    } catch (error) {
        console.error("Error updating the emotion");
        return {};
    }
};
