import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import styles from './CreateChannelModal.module.scss';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
import channelAPI from '../../api/channelAPI';
import socket from '../../socket';

const cx = classNames.bind(styles);

function CreateChannelModal() {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [cookies] = useCookies();

  const handleClose = () => {
    store.dispatch(Actions.showCreateChannelModal(false));
  };

  const handleSubmit = async () => {
    if (name.trim() === '') {
      alert('Channel name cannot be empty');
      return;
    }

    const res = await channelAPI.createChannel({
      admin: cookies.id,
      name: name,
      private: isPrivate,
    });
    console.log(res);
    socket.emit('update_channel');

    if (res.status) {
      store.dispatch(Actions.showCreateChannelModal(false));
    } else {
      alert(res.message);
    }
  };

  return (
    <div className={cx('overlay')}>
      <div className={cx('inner')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('header__title')}>Create new channel</div>
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx('content')}>
            <div className={cx('input-text')}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Channel name"
              ></input>
            </div>
            <div className={cx('input-checkbox')}>
              Private ?
              <input
                type="checkbox"
                value={isPrivate}
                onChange={(e) => {
                  console.log(e.target.checked);
                  setIsPrivate(e.target.checked);
                }}
              ></input>
            </div>
          </div>
          <div className={cx('footer')}>
            <div className={cx('btn')} onClick={handleClose}>
              Cancel
            </div>
            <div className={cx('btn', 'primary')} onClick={handleSubmit}>
              Create
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateChannelModal;
