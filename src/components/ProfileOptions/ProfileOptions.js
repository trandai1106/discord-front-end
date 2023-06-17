import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

import styles from "./ProfileOptions.module.scss";
import authAPI from '../../api/authAPI';

const cx = classNames.bind(styles);

function ProfileOptions() {
  const navigate = useNavigate();

  const logout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return <div className={cx('wrapper')}>
    <div className={cx('inner')}>
      <div className={cx('item')}>Profile Setting</div>
      <div className={cx('item')} onClick={logout}>Log out</div>
    </div>
  </div>
};

export default ProfileOptions;