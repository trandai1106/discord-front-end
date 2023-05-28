/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Chat.module.scss";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DirectMessage from "./DirectMessage";
import Welcome from "./Welcome";

const cx = classNames.bind(styles);

function Chat() {
  const [cookies, setCookies] = useCookies();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const directMessageId = urlParams.get('direct-message');
  const channelId = urlParams.get('channel');

  useEffect(() => {
    const checkCookies = () => {
      if (!cookies.access_token) {

        /*
          Check cookies on server side?
        */

        navigate("/login");
      }
    };
    checkCookies();
  }, []);

  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>
        <Sidebar />
        <div className={cx('content')}>
          {/* {channelId && <Channel 
            channelId={channelId}  
          />} */}
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