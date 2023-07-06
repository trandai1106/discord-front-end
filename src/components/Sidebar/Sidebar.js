import classNames from 'classnames/bind';
import { faSortDown, faSortUp, faHashtag, faUserGroup, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import SidebarNav from './SidebarNav/SidebarNav';
import ChannelOption from './ChannelOption/ChannelOption';
import DirectMessageOption from './DirectMessageOption/DirectMessageOption';
import direcectMessageAPI from '../../api/direcectMessageAPI';
import channelAPI from '../../api/channelAPI';
import socket from '../../socket';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Sidebar() {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getSizebarOptions = async () => {
      const res = await direcectMessageAPI.getContacts();
      setDirectMessages(res.data);
      const result = await channelAPI.getJoinedChannels();
      setChannels(result.data);
    };
    getSizebarOptions();

    socket.on('s_directMessage', () => {
      getSizebarOptions();
    });

    socket.on('s_roomMessage', () => {
      getSizebarOptions();
    });
  }, []);

  // Setups for adjusting sidebar width
  const handleMouseDown = (event) => {
    event.preventDefault();
    event.target.classList.add(cx('resize-active'));
    setIsResizing(true);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      setWidth(event.clientX);
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

  const handleAddChannel = () => {
    store.dispatch(Actions.showCreateChannelModal(true));
  };

  return (
    <div className={cx('wrapper')} style={{ width: width }}>
      <div
        className={cx('resize-container')}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
      >
        <div className={cx('resize')}></div>
      </div>
      <div className={cx('spread')}></div>
      <div className={cx('title')}>
        <h3>GROUP 10</h3>
      </div>
      <div className={cx('spread')}></div>
      <div className={cx('list')}>
        <SidebarNav
          title="People"
          icon={faUserGroup}
          onClick={() => {
            navigate('/chat');
          }}
        />
        <SidebarNav
          title="Channels"
          icon={showChannels ? faSortUp : faSortDown}
          onClick={() => {
            setShowChannels(!showChannels);
          }}
        />
        {showChannels &&
          channels.map((room, index) => {
            return <ChannelOption key={index} title={room.name} icon={faHashtag} id={room._id} />;
          })}
        <div className={cx('add-channel')} onClick={handleAddChannel}>
          <FontAwesomeIcon className={cx('add-channel-icon')} icon={faPlus} />
          Add channels
        </div>
        <div className={cx('spread')}></div>
        <SidebarNav
          title="Direct messages"
          icon={showDirectMessages ? faSortUp : faSortDown}
          onClick={() => setShowDirectMessages(!showDirectMessages)}
        />
        {showDirectMessages &&
          directMessages.map((user, index) => {
            return <DirectMessageOption key={index} userId={user.user_id} />;
          })}
      </div>
    </div>
  );
}

export default Sidebar;
