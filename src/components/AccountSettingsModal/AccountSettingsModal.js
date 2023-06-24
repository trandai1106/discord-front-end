import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "./AccountSettingsModal.module.scss";
import * as Actions from "../../store/actions/index";
import store from '../../store/store';
import { useState } from 'react';
import userAPI from '../../api/userAPI';
import authAPI from '../../api/authAPI';
import { useCookies } from 'react-cookie';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

function AccountSettingsModal() {
  const [name, setName] = useState("Test");
  const [previewAvatar, setPreviewAvatar] = useState(avatarBaseUrl + "/avatars/default_avatar_purple.jpg");
  const [avatar, setAvatar] = useState(null);
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const userId = cookies.id;

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(userId);
      if (res.status === 0) {
        authAPI.logout();
        navigate('login');
      }
      setName(res.data.user.name);
      setPreviewAvatar(avatarBaseUrl + res.data.user.avatar);
      console.log(res);
    };
    if (userId !== '') {
      getUserInfo();
    }
  }, [userId]);

  const handleClose = () => {
    store.dispatch(
      Actions.toogleAccountSettingsModal(false)
    );
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const onSubmit = () => {
    alert(`change Name ${name}`);
    store.dispatch(
      Actions.toogleAccountSettingsModal(false)
    );
  }

  const handleChangePreviewAvatar = (e) => {
    if (e.target.files[0]) {
      setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className={cx("overlay")}>
      <div className={cx("inner")}>
        <div className={cx("container")}>
          <div className={cx("header")}>
            <div className={cx("header__title")}>Account settings</div>
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx("content")}>
            <div className={cx("avatar")}>
              <img src={previewAvatar} alt="avatar"></img>
              <div className={cx("upload", "btn")}>
                <input
                  name="avatar"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleChangePreviewAvatar}
                ></input>
                Upload Photo
              </div>

            </div>
            <div className={cx("actions")}>
              <div className={cx("action-item")}>
                <div className={cx("title")}>Name</div>
                <input value={name} onChange={handleNameChange}></input>
              </div>
              {/* <div className="password">Change Password</div>
              <div className={cx("action-item")}>
                <div className={cx("title")}>Password</div>
                <input placeholder="Password"></input>
              </div> */}
            </div>
          </div>
          <div className={cx("footer")}>
            <div className={cx("btn")} onClick={handleClose}>Cancel</div>
            <div className={cx("btn", "primary")} onClick={onSubmit}>Save changes</div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AccountSettingsModal;