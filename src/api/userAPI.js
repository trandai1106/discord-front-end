import axiosClient from './axiosClient';

const userAPI = {
  getUserInfo: async (userId) => {
    try {
      const url = '/users/information/' + userId;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getAllUsers: async () => {
    try {
      const url = '/users/all';
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  upLoadUserInfo: async ({ userId, data }) => {
    try {
      const url = '/users/update/' + userId;
      const res = await axiosClient.put(url, data);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  upLoadUserAvatar: async ({ userId, data }) => {
    try {
      const formData = new FormData();
      formData.append('file', data);
      const url = '/users/avatar/' + userId;
      const res = await axiosClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  searchUserByName: async (q) => {
    try {
      const url = `/users/search?q=${q}`;
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
};

export default userAPI;
