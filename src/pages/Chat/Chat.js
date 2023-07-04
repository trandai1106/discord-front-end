/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';

import styles from './Chat.module.scss';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DirectMessage from './DirectMessage/DirectMessage';
import RoomMessage from './RoomMessage/RoomMessage';
import People from './People/People';
import store from '../../store/store';
import UserMenu from '../../components/UserMenu/UserMenu';
import UserProfile from '../../components/UserProfile/UserProfile';
import ProflieSettingsModal from '../../components/ProflieSettingsModal/ProflieSettingsModal';
import socket from '../../socket';
import CallModal from '../../components/CallModal/CallModal';
import * as Actions from '../../store/actions/index';
import GroupMembersModal from '../../components/GroupMembersModal/GroupMembersModal';
import CreateGroupModal from '../../components/CreateGroupModal/CreateGroupModal';

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
  const [showProflieSettingsModal, setShowProflieSettingsModal] = useState(false);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [callData, setCallData] = useState(null);

  useEffect(() => {
    socket.on('directCall', (data) => {
      setCallData({
        ...data,
        type: 'directCall',
      });
      store.dispatch(Actions.showCallModal(true));
    });

    socket.on('roomCall', (data) => {
      setCallData({
        ...data,
        type: 'roomCall',
      });
      if (data.from_id !== myUser.id) {
        store.dispatch(Actions.showCallModal(true));
      }
    });
  }, []);

  const handleChange = () => {
    state.current = store.getState();
    setShowUserMenu(state.current.context.showUserMenu);
    setShowUserProfile(state.current.context.showUserProfile.state);
    setShowProflieSettingsModal(state.current.context.showProfileSettingsModal);
    setShowGroupMembersModal(state.current.context.showGroupMembersModal.state);
    setShowCallModal(state.current.context.showCallModal);
    setShowCreateGroupModal(state.current.context.showCreateGroupModal);
  };
  store.subscribe(handleChange);

  return (
    <>
      <div className={cx('wrapper')}>
        {showProflieSettingsModal && <ProflieSettingsModal />}
        {showCallModal && <CallModal data={callData} />}
        {showGroupMembersModal && <GroupMembersModal id={channelId} />}
        {showUserMenu && <UserMenu />}
        {showCreateGroupModal && <CreateGroupModal />}
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
