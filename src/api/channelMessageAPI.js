import axiosClient from './axiosClient';

const channelMessageAPI = {
  getMessages: async (channelId) => {
    try {
      const url = '/chat/channel/' + channelId;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteMessage: async (id) => {
    try {
      const url = `/chat/channel/${id}`;
      const res = await axiosClient.delete(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default channelMessageAPI;
