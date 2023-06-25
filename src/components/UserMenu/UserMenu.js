import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styles from "./UserMenu.module.scss";
import authAPI from '../../api/authAPI';
import store from "../../store/store";
import * as Actions from "../../store/actions/index";
import socket from "../../socket";

const cx = classNames.bind(styles);

function UserMenu() {
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const handleToogleUserProfile = () => {
    store.dispatch(Actions.toogleUserProfile({
      state: true,
      userId: cookies.id
    }));
    store.dispatch(Actions.toogleUserMenu(false));
  };

  const handleShowAccountSettings = () => {
    store.dispatch(Actions.toogleAccountSettingsModal(true));
    store.dispatch(Actions.toogleUserMenu(false));
  };

  const handleLogout = () => {
    socket.disconnect();
    authAPI.logout();
    navigate('/login');
  };

  return <div className={cx('wrapper')}>
    <div className={cx('inner')}>
      <div className={cx('item')} onClick={handleToogleUserProfile}>Profile</div>
      <div className={cx('item')} onClick={handleShowAccountSettings}>Account Settings</div>
      <div className={cx('item')} onClick={handleLogout}>Log out</div>
    </div>
  </div>
};

export default UserMenu;