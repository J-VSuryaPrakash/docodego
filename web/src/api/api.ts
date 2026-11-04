import axios, { type AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api: AxiosInstance = axios.create({
    headers: {
        "Content-Type": 'application/json'
    },
    baseURL: BASE_URL,
    withCredentials: true
})

