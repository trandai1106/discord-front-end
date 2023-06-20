import axiosClient from './axiosClient';
import * as Actions from './../store/actions';
import { store } from './../index';

const userAPI = {
  getUserInfo: async (to_id) => {
    try {
      const url = '/users/' + to_id;
      const res = await axiosClient.get(url);
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getAllUsers: async () => {
    try {
      const url = '/users';
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default userAPI;
