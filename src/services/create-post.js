import API from ".";

export const createPost = async (post) => {
    try {
        const response = await API.post("/posts", post);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts");
        return {};
    }
};
