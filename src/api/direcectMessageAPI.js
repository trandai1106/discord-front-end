import axiosClient from './axiosClient';

const direcectMessageAPI = {
  getMessages: async (to_id) => {
    try {
      const url = '/chat/direct/to/' + to_id;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getContacts: async () => {
    try {
      const url = `/chat/direct/contacted`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteMessage: async (id) => {
    try {
      const url = `/chat/direct/delete/${id}`;
      const res = await axiosClient.delete(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default direcectMessageAPI;
