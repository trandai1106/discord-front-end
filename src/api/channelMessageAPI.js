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
      const url = `/chat/channel/delete/${id}`;
      const res = await axiosClient.delete(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchMessages: async ({ channelId, query }) => {
    try {
      const url = `/chat/channel/search/${channelId}?q=${query}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default channelMessageAPI;
