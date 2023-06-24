import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './DirectMessageOption.module.scss';
import userAPI from '../../../api/userAPI';

const cx = classNames.bind(styles);

function DirectMessageOption({ userId }) {
  const [user, setUser] = useState({});
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    //Funciton to get user information by id
    (async () => {
      const res = await userAPI.getUserInfo(userId);
      setUser(res.data.user);
    })();
  }, []);

  //Fake user information
  // const user = {
  //   id: "64722a9611a9b0297c54ae38",
  //   name: "dat2",
  //   avatar: "http://localhost:8080/avatars/default_avatar.png",
  // };

  return (
    <Link className={cx('wrapper')} to={`?direct-message=${user.id}`}>
      <img className={cx('user-profile')} src={avatarBaseUrl + user.avatar} alt="" />
      <span className={cx('title')}>{user.name}</span>
    </Link>
  );
}

export default DirectMessageOption;
