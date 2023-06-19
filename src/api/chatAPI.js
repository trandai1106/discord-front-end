import axiosClient from './axiosClient';
import * as Actions from './../store/actions';
import { store } from './../index';

const chatAPI = {
  getMessages: async (to_id) => {
    try {
      const url = '/chat/direct-message/to/' + to_id;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getContacts: async () => {
    try {
      const url = `/chat/direct-message/contacted`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default chatAPI;
