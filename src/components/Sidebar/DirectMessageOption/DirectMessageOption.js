import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './DirectMessageOption.module.scss';
import userAPI from '../../../api/userAPI';
import socket from '../../../socket';
import store from '../../../store/store';

const cx = classNames.bind(styles);

function DirectMessageOption({ userId }) {
  const myUser = store.getState().auth.user;
  const [user, setUser] = useState({});
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;
  const [isOnline, setIsOnline] = useState('');
  const [notification, setNotification] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [cookies] = useCookies();

  useEffect(() => {
    //Funciton to get user information by id
    (async () => {
      const res = await userAPI.getUserInfo(userId);
      setUser(res.data);
    })();

    socket.on('update_online_user', (data) => {
      if (data.includes(userId)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });

    socket.emit('check_online_user', cookies.id);

    const currentId = location.pathname.split('/direct-message/')[1];
    if (userId === currentId) {
      setNotification(false);
    } else {
      socket.on('s_directMessage', (data) => {
        if (data.from_id === userId) {
          setNotification(true);
        }
      });
    }
  }, [location]);

  return (
    <Link className={cx('wrapper')} to={`/direct-message/${user.id}`}>
      <div className={cx('avatar-container')}>
        <img className={cx('avatar')} src={avatarBaseUrl + user.avatar} alt="" />
        <div className={cx('status', isOnline ? 'active' : '')}></div>
      </div>
      <div className={cx('title')}>{user.name}</div>
      {notification && <div className={cx('notification')}>{'!'}</div>}
    </Link>
  );
}

export default DirectMessageOption;
