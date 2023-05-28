import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from "./ProfileSetting.module.scss";

const cx = classNames.bind(styles);

function ProfileSetting() {
  const dispatch = useDispatch();
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const toggleProfileSetting = () => {
    dispatch({ type: 'TOGGLE_PROFILE_SETTING' });
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
      console.log('mouseMove', window.innerWidth - event.clientX);
    }
  };

  const handleMouseLeave = (event) => {
    event.target.classList.remove(cx('resize-active'));
    setIsResizing(false);
  };

  const handleMouseUp = (event) => {
    setIsResizing(false);
    event.target.classList.remove(cx('resize-active'));
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
      <div onClick={toggleProfileSetting} className={cx('icon')}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
    </div>
  </div>
}

export default ProfileSetting;