import axiosClient from './axiosClient';
import * as Actions from '../store/actions';
import { store } from '../index';

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
      const url = '/room/' + roomId;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getMessages: async (room_id) => {
    try {
      const url = '/room/' + room_id + '/message';
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
};

export default chatRoomAPI;