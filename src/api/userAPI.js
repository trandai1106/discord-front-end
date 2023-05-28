import axiosClient from "./axiosClient"
import * as Actions from "./../store/actions"
import { store } from './../index'


const userAPI = {
    getUserInfo: async (to_id) => {
        try {
            const url = '/users/' + to_id;
            const response = await axiosClient.get(url);
            return response.data;
        } catch (err) {
            console.log("Error", err);
        }
    }
}

export default userAPI;