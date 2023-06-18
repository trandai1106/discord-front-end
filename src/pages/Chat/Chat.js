/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Chat.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import DirectMessage from "./DirectMessage/DirectMessage";
import Welcome from "./Welcome/Welcome";
import store from "../../store/store";
import UserMenu from "../../components/UserMenu/UserMenu";
import UserProfile from "../../components/UserProfile/UserProfile";
import { useCookies } from "react-cookie";

const cx = classNames.bind(styles);

function Chat() {
  const urlParams = new URLSearchParams(window.location.search);
  const directMessageId = urlParams.get('direct-message');
  const channelId = urlParams.get('channel');
  const navigate = useNavigate();
  const state = useRef(store.getState());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [cookies] = useCookies();

  const handleChange = () => {
    state.current = store.getState();
    setShowUserMenu(state.current.context.showUserMenu);
    setShowUserProfile(state.current.context.showUserProfile.state);
  }
  store.subscribe(handleChange);

  useEffect(() => {
    if (!state.current.auth.isLoggedIn) {
      navigate("/login");
    }
  }, [state.current.auth.isLoggedIn]);

  return (
    <div className={cx('wrapper')}>
      {showUserMenu && <UserMenu />}
      <Header />
      <div className={cx('container')}>
        <Sidebar />
        <div className={cx('content')}>
          {directMessageId && !channelId && <DirectMessage
            directMessageId={directMessageId}
          />}
          {!directMessageId && !channelId &&
            <Welcome />
          }
        </div>
        {showUserProfile && <UserProfile />}
      </div>
    </div>
  );
}

export default Chat;