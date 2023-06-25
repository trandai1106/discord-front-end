import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  }, []);

  return (
    <Link className={cx('wrapper')} to={`?direct-message=${user.id}`}>
      <div className={cx("avatar-container")}>
        <img className={cx('avatar')} src={avatarBaseUrl + user.avatar} alt="" />
        <div className={cx("status", isOnline ? "active" : "")}></div>
      </div>
      <span className={cx('title')}>{user.name}
      </span>
    </Link>
  );
}

export default DirectMessageOption;
