import axiosClient from './axiosClient';

const channelChatAPI = {
  getJoinedChannels: async () => {
    try {
      const url = '/channel/joined';
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getAllChannels: async () => {
    try {
      const url = '/channel/all';
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getChannel: async (channelId) => {
    try {
      const url = '/channel/information/' + channelId;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  createChannel: async (data) => {
    try {
      const url = `/channel/create`;
      const res = await axiosClient.post(url, data);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getMembers: async (id) => {
    try {
      const url = `/channel/members/${id}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchMembersByName: async ({ channelId, query }) => {
    try {
      const url = `/channel/search/members/${channelId}?q=${query}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getPeopleNotInChannel: async (channelId) => {
    try {
      const url = `/channel/notmember/${channelId}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchPeopleNotInChannelByName: async ({ channelId, query }) => {
    try {
      const url = `/channel/search/notmember/${channelId}?q=${query}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  addMember: async ({ channelId, userId }) => {
    try {
      const url = `/channel/add/${channelId}`;
      const res = await axiosClient.post(url, { userId: userId });
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteMember: async ({ channelId, userId }) => {
    try {
      const url = `/channel/delete/${channelId}`;
      const res = await axiosClient.post(url, { userId: userId });
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default channelChatAPI;
