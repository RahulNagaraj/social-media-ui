import axios from "axios";

export const SERVER_URI = "https://social-media-api.rnmuddebihal.workers.dev";
export const DEV_SERVER_URI = "http://127.0.0.1:8787";

export default axios.create({
    baseURL: SERVER_URI,
});
