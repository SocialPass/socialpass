import axios from "axios";

export let baseURL = "http://localhost:8000";

if (import.meta.env.VITE_APP_API_URL) {
	baseURL = import.meta.env.VITE_APP_API_URL;
}

const client = axios.create({
	baseURL,
});

export default client;
