/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Chat.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import DirectMessage from "./DirectMessage/DirectMessage";
import Welcome from "./Welcome/Welcome";
import store from "../../store/store";

const cx = classNames.bind(styles);

function Chat() {
  const urlParams = new URLSearchParams(window.location.search);
  const directMessageId = urlParams.get('direct-message');
  const channelId = urlParams.get('channel');
  const navigate = useNavigate();
  const state = store.getState();

  useEffect(() => {
    console.log(state);
    if (!state.auth.isLoggedIn) {
      navigate("/login");
    }
  }, [state.auth.isLoggedIn]);

  return (
    <div className={cx('wrapper')}>
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
      </div>
    </div>
  );
}

export default Chat;