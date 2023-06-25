import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.scss';
import * as Actions from '../../../store/actions/index';
import store from '../../../store/store';
import userAPI from '../../../api/userAPI';
import authAPI from '../../../api/authAPI';

const cx = classNames.bind(styles);

function Profile() {
  const [cookies] = useCookies();
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(cookies.id);
      if (res.status === 0) {
        authAPI.logout();
        navigate('login');
      }
      setAvatar(res.data.user.avatar);
    };
    getUserInfo();
  }, []);

  const handleToogleUserMenu = () => {
    const showUserMenu = store.getState().context.showUserMenu;
    store.dispatch(Actions.showUserMenu(!showUserMenu));
  };

  return (
    <div className={cx('wrapper')}>
      <img className={cx('user-profile')} src={avatarBaseUrl + avatar} alt="" onClick={handleToogleUserMenu} />
    </div>
  );
}

export default Profile;
