import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './GroupMembersModal.module.scss';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
import { useState } from 'react';
import userAPI from '../../api/userAPI';
import authAPI from '../../api/authAPI';
import chatRoomAPI from '../../api/chatRoomAPI';
import { useCookies } from 'react-cookie';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

function GroupMembersModal(props) {
  var [members, setMembers] = useState([]);

  useEffect(() => {
    const getMembers = async () => {
      const res = await chatRoomAPI.getMembers(props.id);
      if (res) {
        if (res.data) {
          members = res.data.members;
          setMembers(members);
          console.log(members);
        }
      }
    };
    if (props) {
      getMembers(props.id);
    }
  }, [props.id]);

  const handleClose = () => {
    store.dispatch(
      Actions.showGroupMembersModal({
        state: false,
        groupId: '',
      }),
    );
  };

  const hanldeClick = (userId) => {
    store.dispatch(
      Actions.showUserProfile({
        state: true,
        userId: userId,
      }),
    );
  };

  return (
    <div className={cx('overlay')}>
      <div className={cx('inner')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('header__title')}>Group members</div>
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx('content')}>
            {members.length != 0
              ? members.map((members, index) => {
                  // return members.length === 0 ? (
                  //   <></>
                  // ) : (
                  return (
                    <div className={cx('content-item')}>
                      <div className={cx('avatar')}>
                        <img src={avatarBaseUrl + members.avatar_url}></img>
                      </div>
                      <div
                        className={cx('name')}
                        onClick={() => {
                          hanldeClick(members._id);
                        }}
                      >
                        {members.name}
                      </div>
                    </div>
                  );
                  // );
                })
              : ''}
          </div>
          <div className={cx('footer')}>
            <div className={cx('btn')} onClick={handleClose}>
              Close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupMembersModal;
