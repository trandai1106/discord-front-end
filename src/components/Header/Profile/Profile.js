import classNames from "classnames/bind";
import { useState, useRef, useEffect } from "react";

import styles from "./Profile.module.scss";
import * as Actions from "../../../store/actions/index";
import store from "../../../store/store";

const cx = classNames.bind(styles);

function Profile() {
  const handleToogleUserMenu = () => {
    const showUserMenu = store.getState().context.showUserMenu;
    store.dispatch(Actions.toogleUserMenu(!showUserMenu));
  };

  return <div className={cx('wrapper')}>
    <img
      className={cx('user-profile')}
      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
      alt=""
      onClick={handleToogleUserMenu}
    />
  </ div >
}

export default Profile;