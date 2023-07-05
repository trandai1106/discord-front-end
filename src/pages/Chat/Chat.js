/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './Chat.module.scss';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DirectMessage from './DirectMessage/DirectMessage';
import ChannelMessage from './ChannelMessage/ChannelMessage';
import People from './People/People';
import store from '../../store/store';
import UserMenu from '../../components/UserMenu/UserMenu';
import UserProfile from '../../components/UserProfile/UserProfile';
import ProflieSettingsModal from '../../components/ProflieSettingsModal/ProflieSettingsModal';
import socket from '../../socket';
import CallModal from '../../components/CallModal/CallModal';
import * as Actions from '../../store/actions/index';
import GroupMembersModal from '../../components/ChannelMembersModal/ChannelMembersModal';
import CreateChannelModal from '../../components/CreateChannelModal/CreateChannelModal';

const cx = classNames.bind(styles);

function Chat() {
  const [searchParams] = useSearchParams();
  const directMessageId = searchParams.get('direct-message');
  const channelId = searchParams.get('channel');
  const myUser = store.getState().auth.user;
  const state = useRef(store.getState());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProflieSettingsModal, setShowProflieSettingsModal] = useState(false);
  const [showChannelMembersModal, setShowChannelMembersModal] = useState(false);
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
    setShowCallModal(state.current.context.showCallModal);
    setShowCreateChannelModal(state.current.context.showCreateChannelModal);
  };
  store.subscribe(handleChange);

  return (
    <>
      <div className={cx('wrapper')}>
        {showProflieSettingsModal && <ProflieSettingsModal />}
        {showCallModal && <CallModal data={callData} />}
        {showChannelMembersModal && <GroupMembersModal id={channelId} />}
        {showUserMenu && <UserMenu />}
        {showCreateChannelModal && <CreateChannelModal />}
        <Header />
        <div className={cx('container')}>
          <Sidebar />
          <div className={cx('content')}>
            {directMessageId && !channelId && <DirectMessage directMessageId={directMessageId} />}
            {!directMessageId && channelId && <ChannelMessage ChannelMessageId={channelId} />}
            {!directMessageId && !channelId && <People />}
          </div>
          {showUserProfile && <UserProfile />}
        </div>
      </div>
    </>
  );
}

export default Chat;
