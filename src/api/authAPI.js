import axiosClient from "./axiosClient";
import * as Actions from "./../store/actions";
import store from "../store/store";

const authAPI = {
    register: async (params) => {
        try {
            const url = '/auth/register';
            const res = await axiosClient.post(url, params);
            if (res.data.status) {
                const token = res.data.data.access_token;
                const id = res.data.data.id;
                document.cookie = `access_token=${token}; path=/`;
                document.cookie = `id=${id}; path=/`;
                // store.dispatch(Actions.saveUserToRedux(res.data.user));
            }
            return res.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    login: async (params) => {
        try {
            const url = '/auth/login';
            const res = await axiosClient.post(url, params);
            if (res.data.status) {
                const token = res.data.data.access_token;
                const id = res.data.data.id;
                document.cookie = `access_token=${token}; path=/`;
                document.cookie = `id=${id}; path=/`;
                // store.dispatch(Actions.saveUserToRedux(res.data.user));
            }
            return res.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    logout: async () => {
        try {
            const url = '/auth/logout';
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // store.dispatch(Actions.removeUserOutOfRedux(null))
            const res = await axiosClient.post(url);
            return res.data;
        } catch (err) {
            console.log("Error", err);
        }

    },

    getProfile: async () => {
        try {
            const url = '/auth/profile';
            const res = await axiosClient.get(url);
            return res.data;
        } catch (err) {
            console.log("Error", err);
            return {
                status: 0,
                message: err
            };
        }
    },

    updateProfile: async (params) => {
        try {
            const url = '/auth/profile';
            const res = await axiosClient.put(url, params);
            return res.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    uploadAvatar: async (params) => {
        try {
            const url = '/image/upload';
            const res = await axiosClient.post(url, params);
            return res.data;
        } catch (err) {
            alert(err.message);
        }
    }
}

export default authAPI;