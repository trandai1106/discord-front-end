import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import styles from './NotFound.module.scss';
import store from '../../store/store';

const cx = classNames.bind(styles);

function NotFound() {
  const navigate = useNavigate();
  const state = store.getState();

  useEffect(() => {
    if (!state.auth.isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/allchannels');
    }
  }, [state]);

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('content')}>Page not found</h1>
    </div>
  );
}

export default NotFound;
