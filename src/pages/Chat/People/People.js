import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useCookies } from 'react-cookie';
import { useSearchParams, useLocation } from 'react-router-dom';

import styles from './People.module.scss';
import userAPI from '../../../api/userAPI';
import store from '../../../store/store';
import * as Actions from '../../../store/actions/index';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

function People() {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.users);
    };

    const getUserByName = async (query) => {
      const res = await userAPI.searchUserByName(query);
      console.log(res.data.users);
      setUsers(res.data.users);
    };

    setQuery(searchParams.get('q'));
    if (searchParams.get('q')) {
      getUserByName(searchParams.get('q'));
    } else {
      getAllUsers();
    }
  }, [location]);

  const hanldeClick = (userId) => {
    store.dispatch(
      Actions.showUserProfile({
        state: true,
        userId: userId,
      }),
    );
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('heading')}>{query ? <h2>Search results for {query}</h2> : <h2>All users</h2>}</div>
      <div className={cx('content')}>
        {users.map((user) => {
          return user._id === cookies.id ? (
            <div key={user._id}></div>
          ) : (
            <div className={cx('content-item')} key={user._id}>
              <div className={cx('avatar')}>
                <img src={avatarBaseUrl + user.avatar_url} alt="avatar"></img>
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
