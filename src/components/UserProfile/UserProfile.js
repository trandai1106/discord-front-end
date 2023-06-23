import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import styles from './UserProfile.module.scss';
import store from '../../store/store';
import * as Actions from '../../store/actions/index';
import userAPI from '../../api/userAPI';
import authAPI from '../../api/authAPI';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

function UserProfile() {
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [cookies] = useCookies();
  const [userId, setUserId] = useState(() => {
    return store.getState().context.showUserProfile.userId;
  });
  const navigate = useNavigate();

  const handleClose = () => {
    store.dispatch(
      Actions.toogleUserProfile({
        state: false,
        userId: '',
      }),
    );
  };

  const handleUserEdit = () => {
    store.dispatch(
      Actions.toogleAccountSettingsModal(true)
    );
  };

  const handleChange = () => {
    const storeState = store.getState();
    setUserId(storeState.context.showUserProfile.userId);
  };
  store.subscribe(handleChange);

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(userId);
      if (res.status === 0) {
        authAPI.logout();
        navigate('login');
      }
      setName(res.data.user.name);
      setAvatar(res.data.user.avatar);
      console.log(res);
    };
    if (userId !== '') {
      getUserInfo();
    }
  }, [userId]);

  // Setups for adjusting profile setting width
  const handleMouseDown = (event) => {
    event.preventDefault();
    event.target.classList.add(cx('resize-active'));
    setIsResizing(true);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      setWidth(window.innerWidth - event.clientX);
    } else {
      event.target.classList.remove(cx('resize-active'));
    }
  };

  const handleMouseLeave = (event) => {
    event.target.classList.remove(cx('resize-active'));
    setIsResizing(false);
  };

  const handleMouseUp = (event) => {
    event.target.classList.remove(cx('resize-active'));
    setIsResizing(false);
  };

  return (
    <div className={cx('wrapper')} style={{ width: width }}>
      <div
        className={cx('resize-container')}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
      >
        <div className={cx('resize')}></div>
      </div>
      <div className={cx('header')}>
        <p>Profile</p>
        <div onClick={handleClose} className={cx('icon')}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      <div className={cx('content')}>
        <div className={cx('user-container')}>
          <img src={avatarBaseUrl + avatar}></img>
          <div className={cx('details')}>
            <div className={cx('username')}>{name}</div>
            {userId === cookies.id ? (
              <div className={cx('edit')} onClick={handleUserEdit}>
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </div>
            ) : (
              <Link to={`?direct-message=${userId}`} className={cx('chat')}>
                Chat with {name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
