import classNames from 'classnames/bind';
import { faSortDown, faSortUp, faHashtag, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import SidebarNav from './SidebarNav/SidebarNav';
import ChannelOption from './ChannelOption/ChannelOption';
import DirectMessageOption from './DirectMessageOption/DirectMessageOption';
import chatAPI from '../../api/chatAPI';

const cx = classNames.bind(styles);

function Sidebar() {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);
  const [cookies] = useCookies();
  const navigate = useNavigate();

  // Fake channels
  const channels = [
    {
      name: 'Test channel',
      id: '12345',
    },
  ];
  // Fake direct message
  useEffect(() => {
    (async () => {
      const res = await chatAPI.getContacts();
      console.log(res.data.contacted_data);
      setDirectMessages(res.data.contacted_data);
    })();
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
          channels.map((element, index) => {
            return <ChannelOption key={index} title={element.name} icon={faHashtag} id={element.id} />;
          })}
        <div className={cx('spread')}></div>
        <SidebarNav
          title="Direct messages"
          icon={showDirectMessages ? faSortUp : faSortDown}
          onClick={() => setShowDirectMessages(!showDirectMessages)}
        />
        {showDirectMessages &&
          directMessages.map((user, index) => {
            console.log(user);
            return <DirectMessageOption key={index} userId={user.user_id} />;
          })}
      </div>
    </div>
  );
}

export default Sidebar;
