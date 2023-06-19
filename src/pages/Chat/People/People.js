import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useCookies } from 'react-cookie';

import styles from './People.module.scss';
import userAPI from '../../../api/userAPI';
import store from '../../../store/store';
import * as Actions from '../../../store/actions/index';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

function People() {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies();

  useEffect(() => {
    (async () => {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.users);
    })();
  }, []);

  const hanldeClick = (userId) => {
    store.dispatch(
      Actions.toogleUserProfile({
        state: true,
        userId: userId,
      }),
    );
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('heading')}>
        <h2>All users</h2>
      </div>
      <div className={cx('content')}>
        {users.map((user) => {
          return user._id === cookies.id ? (
            <></>
          ) : (
            <div className={cx('content-item')}>
              <div className={cx('avatar')}>
                <img src={avatarBaseUrl + user.avatar_url}></img>
              </div>
              <div
                className={cx('name')}
                onClick={() => {
                  hanldeClick(user._id);
                }}
              >
                {user.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default People;
