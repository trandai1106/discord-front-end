import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { faHashtag, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import styles from './AllChannels.module.scss';
import channelAPI from '../../api/channelAPI';
import socket from '../../socket';

const cx = classNames.bind(styles);

function AllChannels() {
  const [channels, setChannels] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [cookies] = useCookies();

  useEffect(() => {
    socket.on('update_channel', () => {
      init();
    });

    const getAllChannels = async () => {
      const res = await channelAPI.getAllChannels();
      setChannels(res.data);
    };

    const getChannelsByName = async (query) => {
      const res = await channelAPI.searchChannelsByName(query);
      console.log(res);
      setChannels(res.data);
    };

    const init = () => {
      setQuery(searchParams.get('q'));
      if (searchParams.get('q')) {
        getChannelsByName(searchParams.get('q'));
      } else {
        getAllChannels();
      }
    };

    init();

    return () => {
      socket.off('update_channel', () => {
        init();
      });
    };
  }, [location]);

  const handleJoinChannel = async (channelId) => {
    const res = await channelAPI.addMember({
      channelId: channelId,
      userId: cookies.id,
    });
    console.log(res);
    socket.emit('update_channel');
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('heading')}>{query ? <h2>Search results for {query}</h2> : <h2>All channels</h2>}</div>
      <div className={cx('content')}>
        {channels.map((channel) => {
          return (
            <div className={cx('channel')} key={channel._id}>
              <div className={cx('row')}>
                <div className={cx('private')}>
                  <FontAwesomeIcon icon={channel.private ? faLock : faHashtag} />
                </div>
                {channel.members.includes(cookies.id) ? (
                  <Link to={`/channel-message/${channel._id}`} className={cx('name')}>
                    {channel.name}
                  </Link>
                ) : (
                  <div className={cx('name')}>{channel.name}</div>
                )}
              </div>
              <div className={cx('row')}>
                <div className={cx('members')}>{channel.members.length + ' members'}</div>
                {channel.members.includes(cookies.id) ? (
                  <div className={cx('joined')}>
                    <FontAwesomeIcon icon={faCheck} />
                    joined
                  </div>
                ) : (
                  <div
                    className={cx('join')}
                    onClick={() => {
                      handleJoinChannel(channel._id);
                    }}
                  >
                    Join
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllChannels;
