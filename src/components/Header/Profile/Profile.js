import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import styles from "./Profile.module.scss";
import * as Actions from "../../../store/actions/index";
import store from "../../../store/store";
import userAPI from "../../../api/userAPI";

const cx = classNames.bind(styles);

function Profile() {
  const [cookies] = useCookies();
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(cookies.id);
      setAvatar(res.data.user.avatar);
    };
    getUserInfo();
  }, []);

  const handleToogleUserMenu = () => {
    const showUserMenu = store.getState().context.showUserMenu;
    store.dispatch(Actions.toogleUserMenu(!showUserMenu));
  };

  return <div className={cx('wrapper')}>
    <img
      className={cx('user-profile')}
      src={avatarBaseUrl + avatar}
      alt=""
      onClick={handleToogleUserMenu}
    />
  </ div >
}

export default Profile;