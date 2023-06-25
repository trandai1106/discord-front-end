import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams, useLocation } from "react-router-dom";

import styles from './DirectMessageOption.module.scss';
import userAPI from '../../../api/userAPI';
import socket from '../../../socket';
import store from '../../../store/store';

const cx = classNames.bind(styles);

function DirectMessageOption({ userId }) {
  const myUser = store.getState().auth.user;
  const [user, setUser] = useState({});
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;
  const [isOnline, setIsOnline] = useState("");
  const [notification, setNotification] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    //Funciton to get user information by id
    (async () => {
      const res = await userAPI.getUserInfo(userId);
      setUser(res.data.user);
    })();

    socket.on("updateUserOnlineList", (data) => {
      if (data.includes(userId)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });

    socket.emit("checkOnlineUserList", myUser.id);
    const currentId = searchParams.get('direct-message');
    console.log(user.name, currentId);
    if (userId === currentId) {
      setNotification(false);
    } else {
      socket.on("s_directMessage", (data) => {
        if (data.from_id === userId) {
          console.log(data.from_id, userId, currentId);
          setNotification(true);
        }
      });
    }
  }, [location]);

  return (
    <Link className={cx('wrapper')} to={`?direct-message=${user.id}`}>
      <div className={cx("avatar-container")}>
        <img className={cx('avatar')} src={avatarBaseUrl + user.avatar} alt="" />
        <div className={cx("status", isOnline ? "active" : "")}></div>
      </div>
      <div className={cx('title')}>
        {user.name}
      </div>
      {notification && <div className={cx("notification")}>
        {"!"}
      </div>}
    </Link>
  );
}

export default DirectMessageOption;
