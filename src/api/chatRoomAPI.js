import axiosClient from './axiosClient';

const chatRoomAPI = {
  getAllRooms: async () => {
    try {
      const url = '/room';
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getRoom: async (roomId) => {
    try {
      const url = '/room/information/' + roomId;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getMessages: async (room_id) => {
    try {
      const url = '/room/message/' + room_id;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getContacts: async () => {
    try {
      const url = `/room/room-message/contacted`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  createGroup: async (data) => {
    try {
      const url = `/room/create`;
      const res = await axiosClient.post(url, data);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getMembers: async (id) => {
    try {
      const url = `/room/users/members/${id}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchMembersByName: async ({ groupId, query }) => {
    try {
      const url = `/room/users/search/members/${groupId}?q=${query}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getPeopleNotInGroup: async (groupId) => {
    try {
      const url = `/room/users/notmember/${groupId}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchPeopleNotInGroupByName: async ({ groupId, query }) => {
    try {
      const url = `/room/users/search/notmember/${groupId}?q=${query}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  addMember: async ({ channelId, userId }) => {
    try {
      const url = `/room/users/add/${channelId}`;
      const res = await axiosClient.post(url, { userId: userId });
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteMember: async ({ channelId, userId }) => {
    try {
      const url = `/room/users/delete/${channelId}`;
      const res = await axiosClient.post(url, { userId: userId });
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default chatRoomAPI;
