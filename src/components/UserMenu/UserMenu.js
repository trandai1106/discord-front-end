import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styles from "./UserMenu.module.scss";
import authAPI from '../../api/authAPI';
import store from "../../store/store";
import * as Actions from "../../store/actions/index";

const cx = classNames.bind(styles);

function UserMenu() {
  const navigate = useNavigate();
  const userId = useCookies('id');

  const handleToogleUserProfile = () => {
    store.dispatch(Actions.toogleUserProfile({
      state: true,
      userId: userId
    }));
    store.dispatch(Actions.toogleUserMenu(false));
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return <div className={cx('wrapper')}>
    <div className={cx('inner')}>
      <div className={cx('item')} onClick={handleToogleUserProfile}>Profile Setting</div>
      <div className={cx('item')} onClick={handleLogout}>Log out</div>
    </div>
  </div>
};

export default UserMenu;