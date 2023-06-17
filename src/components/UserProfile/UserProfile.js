import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from "./UserProfile.module.scss";
import store from "../../store/store";
import * as Actions from "../../store/actions/index";

const cx = classNames.bind(styles);

function UserProfile() {
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const handleClose = () => {
    store.dispatch(Actions.toogleUserProfile({
      state: false,
      userId: ""
    }));
  };

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

    </div>
  </div>
}

export default UserProfile;