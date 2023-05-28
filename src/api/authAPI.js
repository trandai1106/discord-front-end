import axiosClient from "./axiosClient"
import * as Actions from "./../store/actions"
import { store } from './../index'


const authAPI = {
    register: async (params) => {
        try {
            const url = '/auth/register';
            const response = await axiosClient.post(url, params);
            if (response.data.status) {
                localStorage.setItem('token', response.data.data.access_token);
                store.dispatch(Actions.saveUserToRedux(localStorage.getItem('token')));
                localStorage.setItem('id', response.data.data.id);
                // console.log("dang nhap oke");
            }
            return response.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    login: async (params) => {
        try {
            const url = '/auth/login';
            const response = await axiosClient.post(url, params);
            if (response.data.status) {
                localStorage.setItem('token', response.data.data.access_token);
                store.dispatch(Actions.saveUserToRedux(localStorage.getItem('token')));
                localStorage.setItem('id', response.data.data.id);
                // console.log("dang nhap oke");
            }
            return response.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    logout: async () => {
        try {
            const url = '/auth/logout';
            localStorage.removeItem('token');
            store.dispatch(Actions.removeUserOutOfRedux(null))
            const response = await axiosClient.post(url);
            return response.data;
        } catch (err) {
            console.log("Error", err);
        }

    },

    getProfile: async () => {
        try {
            const url = '/auth/profile';
            const response = await axiosClient.get(url);
            return response.data;
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
            const response = await axiosClient.put(url, params);
            return response.data;
        } catch (err) {
            console.log("Error", err);
        }
    },

    uploadAvatar: async (params) => {
        try {
            const url = '/image/upload';
            const response = await axiosClient.post(url, params);
            return response.data;
        } catch (err) {
            alert(err.message);
        }
    }
}

export default authAPI;