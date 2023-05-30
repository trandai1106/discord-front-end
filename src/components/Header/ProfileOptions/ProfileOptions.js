import classNames from "classnames/bind";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import styles from "./ProfileOptions.module.scss";

const cx = classNames.bind(styles);

function ProfileOptions() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const logout = () => {
    console.log('logout');
    removeCookie('access_token');
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