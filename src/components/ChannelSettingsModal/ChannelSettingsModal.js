import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSearch, faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { Spin, Select } from 'antd';
import { useCookies } from 'react-cookie';

import styles from './ChannelSettingsModal.module.scss';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
import channelAPI from '../../api/channelAPI';
import socket from '../../socket';

const cx = classNames.bind(styles);

function ChannelSettingsModal() {
  const [name, setName] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState();
  const [admin, setAdmin] = useState();
  const state = store.getState().context.showChannelSettingsModal;
  const [cookies] = useCookies();
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    getChannelInfomation();
    getMembersInChannel();
  }, []);

  const getChannelInfomation = async () => {
    setIsLoading(true);
    const res = await channelAPI.getChannel(state.channelId);
    console.log(state.channelId, res);
    setName(res.data.name);
    setIsPrivate(res.data.private);
    setAdmin(res.data.admin);
    setIsLoading(false);
  };

  const getMembersInChannel = async () => {
    setIsLoading(true);
    const res = await channelAPI.getMembers(state.channelId);
    if (res.status) {
      const options = res.data.map((member) => {
        return {
          value: member._id,
          label: member.name,
        };
      });
      setMemberOptions(options);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    store.dispatch(Actions.showChannelSettingsModal(false));
  };

  const handleChangeAdmin = (value) => {
    setAdmin(value);
  };

  const handleSubmit = async () => {
    if (name !== '') {
      const res = await channelAPI.updateChannel({
        channelId: state.channelId,
        name: name,
        admin: admin,
        private: isPrivate,
      });
      console.log({
        channelId: state.channelId,
        name: name,
        admin: admin,
        private: isPrivate,
      });
      console.log(res);
      socket.emit('update_channel');
    }

    store.dispatch(Actions.showChannelSettingsModal(false));
  };

  return (
    <div className={cx('overlay')}>
      <div className={cx('inner')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('header__title')}>Channel settings</div>
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx('content')}>
            {isloading ? (
              <div className={cx('loading')}>
                <Spin />
              </div>
            ) : (
              <>
                <div className={cx('input-select')}>
                  Admin
                  <Select
                    defaultValue={cookies.id}
                    size="large"
                    className={cx('select')}
                    onChange={handleChangeAdmin}
                    options={memberOptions}
                  />
                </div>
                <div className={cx('input-text')}>
                  Name
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
                    checked={isPrivate}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setIsPrivate(e.target.checked);
                    }}
                  ></input>
                </div>
              </>
            )}
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

export default ChannelSettingsModal;
