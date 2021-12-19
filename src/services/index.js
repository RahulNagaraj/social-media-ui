import axios from "axios";

const SERVER_URI = "https://social-media-api.rnmuddebihal.workers.dev";
const DEV_SERVER_URI = "http://127.0.0.1:8787";

export default axios.create({
    baseURL: SERVER_URI,
});
