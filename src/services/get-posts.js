import API from ".";

export const getAllPosts = async () => {
    try {
        const response = await API.get("/posts");
        return response.data;
    } catch (error) {
        console.error("Error fetching posts");
        return {};
    }
};
