import classNames from "classnames/bind";
import { useState, useRef, useEffect } from "react";

import styles from "./Profile.module.scss";
import ProfileOptions from "../ProfileOptions";

const cx = classNames.bind(styles);

function Profile() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const clickRef = useRef(null);

  const toggleProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  // handle click outter
  // useEffect(() => {
  //   const handleClick = (event) => {
  //     if (clickRef.current && !clickRef.current.contains(event.target)) {
  //       console.log('Clicked outside of the element!');
  //     }
  //   };

  //   document.addEventListener('click', handleClick);

  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, []);

  return <div className={cx('wrapper')}>
    <img
      className={cx('user-profile')}
      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
      alt=""
      onClick={toggleProfileOptions}
    />
    {showProfileOptions && <ProfileOptions />}
  </ div >
}

export default Profile;