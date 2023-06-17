import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-
// config` for the full list of configs

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    try {
        const cookies = document.cookie.split(';');
        const token = cookies.filter(cookie => cookie.indexOf("access_token") !== -1)[0].split('=')[1];

        console.log(token);
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