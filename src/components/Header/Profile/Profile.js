import classNames from "classnames/bind";
import { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./Profile.module.scss";
// import ProfileSetting from "../../ProfileSetting";

const cx = classNames.bind(styles);

function Profile() {
  // const [showProfileSetting, setShowProfileSetting] = useState(false);
  const dispatch = useDispatch();

  // const toggleProfileSetting = () => {
  //   dispatch({ type: 'TOGGLE_PROFILE_SETTING' });
  // };

  return <div className={cx('wrapper')}>
    <img
      className={cx('user-profile')}
      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
      alt=""
    // onClick={toggleProfileSetting}
    />
    {/* {showProfileSetting && <ProfileSetting />} */}
  </div>
}

export default Profile;