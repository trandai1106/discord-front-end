import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-
// config` for the full list of configs

const baseURL = process.env.REACT_APP_SERVER_URL;

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    try {
        const cookies = document.cookie.split(';');
        const token = cookies.filter(cookie => cookie.includes("access_token="))[0].split('=')[1];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (err) {
        return config;
    }
})

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});

export default axiosClient;