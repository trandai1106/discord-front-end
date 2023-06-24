/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from "react-router-dom";

import styles from './Chat.module.scss';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DirectMessage from './DirectMessage/DirectMessage';
import RoomMessage from './RoomMessage/RoomMessage';
import People from './People/People';
import store from '../../store/store';
import UserMenu from '../../components/UserMenu/UserMenu';
import UserProfile from '../../components/UserProfile/UserProfile';
import AccountSettingsModal from '../../components/AccountSettingsModal/AccountSettingsModal';
import socket from '../../socket';

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_SERVER_URL;

function Chat() {
  const [cookies] = useCookies();
  const [searchParams] = useSearchParams();
  const directMessageId = searchParams.get('direct-message');
  const channelId = searchParams.get('channel');
  const myUser = store.getState().auth.user;
  const state = useRef(store.getState());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);

  useEffect(() => {
    socket.on("directCall", (data) => {
      const isJoin = window.confirm(`You have a call from ${data.from_name}, click ok to join!`);
      if (isJoin) {
        window.open(baseUrl + "/call/" + data.call_id, '_blank', '_self');
        const msg = {
          from_id: cookies.id,
          to_id: data.from_id,
          content: "Joined call",
          access_token: cookies.access_token,
          created_at: Date.now(),
        };
        socket.emit("c_directMessage", msg);
      } else {
        socket.emit("rejectCall", { from_id: cookies.id, to_id: data.from_id, call_id: data.call_id });
        const msg = {
          from_id: cookies.id,
          to_id: data.from_id,
          content: "Sory, I'm busy",
          access_token: cookies.access_token,
          created_at: Date.now(),
        };
        socket.emit("c_directMessage", msg);
      }
    });

    socket.on("roomCall", (data) => {
      if (data.from_id !== myUser.id) {
        const isJoin = window.confirm(`You have a call from ${data.from_name}, click ok to join!`);
        if (isJoin) {
          window.open(baseUrl + "/call/" + data.call_id, '_blank', '_self');
          const msg = {
            from_id: cookies.id,
            room_id: data.room_id,
            content: "Joined call",
            access_token: cookies.access_token,
            created_at: Date.now(),
          };
          socket.emit("c_roomMessage", msg);
        } else {
          socket.emit("rejectCall", { from_id: cookies.id, room_id: data.room_id, call_id: data.call_id });
          const msg = {
            from_id: cookies.id,
            room_id: data.room_id,
            content: "Sory, I'm busy",
            access_token: cookies.access_token,
            created_at: Date.now(),
          };
          socket.emit("c_roomMessage", msg);
        }
      }
    });
  }, []);

  const handleChange = () => {
    state.current = store.getState();
    setShowUserMenu(state.current.context.showUserMenu);
    setShowUserProfile(state.current.context.showUserProfile.state);
    setShowAccountSettingsModal(state.current.context.showAccountSettingsModal);
  };
  store.subscribe(handleChange);

  return (
    <>
      <div className={cx('wrapper')}>
        {showAccountSettingsModal && <AccountSettingsModal />}
        {showUserMenu && <UserMenu />}
        <Header />
        <div className={cx('container')}>
          <Sidebar />
          <div className={cx('content')}>
            {directMessageId && !channelId && <DirectMessage directMessageId={directMessageId} />}
            {!directMessageId && channelId && <RoomMessage roomMessageId={channelId} />}
            {!directMessageId && !channelId && <People />}
          </div>
          {showUserProfile && <UserProfile />}
        </div>
      </div>
    </>

  );
}

export default Chat;
