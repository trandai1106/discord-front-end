/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import styles from './UserScreen.module.scss';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import UserMenu from '../components/UserMenu/UserMenu';
import UserProfile from '../components/UserProfile/UserProfile';
import ProflieSettingsModal from '../components/ProflieSettingsModal/ProflieSettingsModal';
import ChannelMembersModal from '../components/ChannelMembersModal/ChannelMembersModal';
import CreateChannelModal from '../components/CreateChannelModal/CreateChannelModal';
import ChannelSettingsModal from '../components/ChannelSettingsModal/ChannelSettingsModal';
import CallModal from '../components/CallModal/CallModal';
import * as Actions from '../store/actions/index';
import store from '../store/store';

import socket from '../socket';

const cx = classNames.bind(styles);

function UserScreen({ children }) {
  const myUser = store.getState().auth.user;
  const state = useRef(store.getState());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProflieSettingsModal, setShowProflieSettingsModal] = useState(false);
  const [showChannelMembersModal, setShowChannelMembersModal] = useState(false);
  const [showChannelSettingsModal, setShowChannelSettingsModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
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
    setShowChannelMembersModal(state.current.context.showChannelMembersModal.state);
    setShowChannelSettingsModal(state.current.context.showChannelSettingsModal.state);
    setShowCallModal(state.current.context.showCallModal);
    setShowCreateChannelModal(state.current.context.showCreateChannelModal);
  };
  store.subscribe(handleChange);

  return (
    <>
      <div className={cx('wrapper')}>
        {showProflieSettingsModal && <ProflieSettingsModal />}
        {showCallModal && <CallModal data={callData} />}
        {showChannelMembersModal && <ChannelMembersModal />}
        {showChannelSettingsModal && <ChannelSettingsModal />}
        {showUserMenu && <UserMenu />}
        {showCreateChannelModal && <CreateChannelModal />}
        <Header />
        <div className={cx('container')}>
          <Sidebar />
          <div className={cx('content')}>{children}</div>
          {showUserProfile && <UserProfile />}
        </div>
      </div>
    </>
  );
}

export default UserScreen;
