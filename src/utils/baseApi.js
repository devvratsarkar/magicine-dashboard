import axios from "axios";
import { API_BASE_URL } from "./config";

export const publicRequest = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'client-id': '',
        'client-key': '',
        'Cache-Control': 'no-cache',
        // 'Authorization': `Bearer `
    },
});