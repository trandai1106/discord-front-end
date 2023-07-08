import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import styles from './ProflieSettingsModal.module.scss';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
import userAPI from '../../api/userAPI';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

function ProflieSettingsModal() {
  const myUser = store.getState().auth.user;
  const [name, setName] = useState(myUser.name);
  const [previewAvatar, setPreviewAvatar] = useState(avatarBaseUrl + myUser.avatar);
  const [avatar, setAvatar] = useState(null);

  const handleClose = () => {
    store.dispatch(Actions.showProfileSettingsModal(false));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (name !== '' && name !== myUser.name) {
      const res = await userAPI.upLoadUserInfo({
        userId: myUser.id,
        data: {
          name: name,
        },
      });
      console.log(res);
      store.dispatch(Actions.saveUserToRedux(res.data));
    }

    if (avatar !== null) {
      await userAPI.upLoadUserAvatar({
        userId: myUser.id,
        data: avatar,
      });
      window.location.reload();
    }

    store.dispatch(Actions.showProfileSettingsModal(false));
  };

  const handleChangePreviewAvatar = (e) => {
    if (e.target.files[0]) {
      setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className={cx('overlay')}>
      <div className={cx('inner')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('header__title')}>Account settings</div>
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx('content')}>
            <div className={cx('avatar')}>
              <img src={previewAvatar} alt="avatar"></img>
              <div className={cx('upload', 'btn')}>
                <input
                  name="avatar"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleChangePreviewAvatar}
                ></input>
                Upload Photo
              </div>
            </div>
            <div className={cx('actions')}>
              <div className={cx('action-item')}>
                <div className={cx('title')}>Name</div>
                <input value={name} onChange={handleNameChange}></input>
              </div>
              {/* <div className="password">Change Password</div>
              <div className={cx("action-item")}>
                <div className={cx("title")}>Password</div>
                <input placeholder="Password"></input>
              </div> */}
            </div>
          </div>
          <div className={cx('footer')}>
            <div className={cx('btn')} onClick={handleClose}>
              Cancel
            </div>
            <div className={cx('btn', 'primary')} onClick={handleSubmit}>
              Save changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProflieSettingsModal;
