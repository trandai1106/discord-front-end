import classNames from "classnames/bind";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from "./UserProfile.module.scss";
import store from "../../store/store";
import * as Actions from "../../store/actions/index";
import userAPI from "../../api/userAPI";

const cx = classNames.bind(styles);

function UserProfile({ userId }) {
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const avatarBaseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  const handleClose = () => {
    store.dispatch(Actions.toogleUserProfile(false));
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(userId);
      setName(res.data.user.name);
      setAvatar(res.data.user.avatar);
      console.log(res);
    };
    getUserInfo();
  }, []);

  // Setups for adjusting profile setting width
  const handleMouseDown = (event) => {
    event.preventDefault();
    event.target.classList.add(cx('resize-active'));
    setIsResizing(true);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      setWidth(window.innerWidth - event.clientX);
    } else {
      event.target.classList.remove(cx('resize-active'));
    }
  };

  const handleMouseLeave = (event) => {
    event.target.classList.remove(cx('resize-active'));
    setIsResizing(false);
  };

  const handleMouseUp = (event) => {
    event.target.classList.remove(cx('resize-active'));
    setIsResizing(false);
  };

  return <div className={cx('wrapper')} style={{ width: width }}>
    <div
      className={cx("resize-container")}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <div className={cx("resize")}></div>
    </div>
    <div className={cx('header')}>
      <p>Profile</p>
      <div onClick={handleClose} className={cx('icon')}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
    </div>
    <div className={cx("content")}>
      <div className={cx("user-container")}>
        <img src={avatarBaseUrl + avatar}></img>
        <div className={cx("username")}>{name}</div>
      </div>
    </div>
  </div>
}

export default UserProfile;