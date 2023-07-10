/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPhone, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ScrollableFeed from 'react-scrollable-feed';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import uuid4 from 'uuid4';

import styles from './DirectMessage.module.scss';
import Message from '../../components/Message/Message';
import direcectMessageAPI from '../../api/direcectMessageAPI';
import userAPI from '../../api/userAPI';
import authAPI from '../../api/authAPI';
import socket from '../../socket';
import store from '../../store/store';

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_SERVER_URL;

function DirectMessage() {
  const myUser = store.getState().auth.user;
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [partner, setPartner] = useState();
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const sendersInfo = useRef({ length: 0 });
  const messagesEnd = useRef();
  const [showActions, setShowActions] = useState(false);
  const { directId } = useParams();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    init();

    socket.on('deleteDirectMessage', (data) => {
      console.log(data);
      setMessages((oldMsgs) => oldMsgs.filter((msg) => msg.id !== data.msg_id));
    });

    socket.on('s_directMessage', handleMessage);

    return () => {
      socket.off('s_directMessage', handleMessage);
    };
  }, [directId, location]);

  const init = () => {
    setIsLoading(true);
    setQuery(searchParams.get('q'));
    if (searchParams.get('q')) {
      setMessages([]);
      getMessageByContent(searchParams.get('q'));
    } else {
      setMessages([]);
      getMessageHistory();
      setShowActions(false);
    }
  };

  const getMessageByContent = async (content) => {
    const res = await direcectMessageAPI.searchMessage({
      from_id: cookies.id,
      to_id: directId,
      query: content,
    });
    console.log(res);
    formatMessages(res);
  };

  const handleMessage = (data) => {
    const msg = {
      id: data._id,
      from_id: data.from_id,
      to_id: data.to_id,
      content: data.content,
      created_at: new Date(),
    };

    if (msg.from_id === directId || msg.from_id === cookies.id) {
      console.log(msg);
      if (sendersInfo.current.length === 0) {
        getMessageHistory();
      } else {
        setMessages((oldMsgs) => [...oldMsgs, msg]);
      }
    }
  };

  const getMessageHistory = async () => {
    setIsLoading(true);
    const res = await userAPI.getUserInfo(directId);
    if (res.status) {
      setPartner(res.data);
    }

    const historyChat = await direcectMessageAPI.getMessages(directId);
    formatMessages(historyChat);
  };

  const formatMessages = async (historyChat) => {
    if (historyChat) {
      if (historyChat.data) {
        const historyMessages = historyChat.data;
        for (let i = 0; i < historyMessages.length; i++) {
          const msg = {
            id: historyMessages[i]._id,
            from_id: historyMessages[i].from_id,
            to_id: historyMessages[i].to_id,
            content: historyMessages[i].content,
            created_at: historyMessages[i].created_at,
          };

          setMessages((oldMsgs) => [...oldMsgs, msg]);

          if (sendersInfo.current[msg.from_id] === undefined) {
            const newSender = await getUserInfo(msg.from_id);
            sendersInfo.current.length++;
            sendersInfo.current[msg.from_id] = newSender;
          }
        }
      }
    }
    setIsLoading(false);
  };

  const getUserInfo = async (id) => {
    const res = await userAPI.getUserInfo(id);
    return {
      username: res.data.name,
      avatar: baseUrl + res.data.avatar,
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input !== null && input !== '') {
      const msg = {
        from_id: cookies.id,
        to_id: directId,
        content: input,
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit('c_directMessage', msg);
      setInput('');
    }
  };

  const makeVideoCall = () => {
    const msg = {
      from_id: cookies.id,
      to_id: directId,
      content: 'Made a new call',
      access_token: cookies.access_token,
      created_at: Date.now(),
    };
    socket.emit('c_directMessage', msg);

    const callId = uuid4().toString();
    socket.emit('direct_call', {
      call_id: callId,
      from_id: cookies.id,
      to_id: directId,
      from_name: myUser.name,
    });
    const callWindow = window.open(baseUrl + '/call/' + callId, '_blank', '_self');

    socket.on('rejectedCall', (data) => {
      callWindow.close();
    });
  };

  const renderActions = () => {
    return (
      <div className={cx('actions-container')}>
        <div className={cx('item')}>Delete chat</div>
      </div>
    );
  };

  const deleteMessage = async (id) => {
    const res = await direcectMessageAPI.deleteMessage(id);
    if (res.status === 1) {
      setMessages((oldMsgs) => oldMsgs.filter((msg) => msg.id !== id));
      socket.emit('deleteDirectMessage', { to_id: directId, msg_id: id });
    }
  };

  return (
    <div className={cx('wrapper')}>
      {partner ? (
        <div className={cx('main')}>
          <div className={cx('channel-header')}>
            <div className={cx('channel-name')}>{partner ? partner.name : ''}</div>
            <div className={cx('call-icon')} onClick={makeVideoCall}>
              <FontAwesomeIcon icon={faPhone} />
            </div>
          </div>
          <ScrollableFeed className={cx('messages')} ref={messagesEnd}>
            {isLoading ? (
              <div className={cx('loading')}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {messages.length === 0 && !searchParams.get('q') ? (
                  <h3 className={cx('zero-message')}>Start chat with {partner.name}</h3>
                ) : (
                  <>
                    {messages.map(
                      (m, index) =>
                        sendersInfo.current[m.from_id] && (
                          <Message
                            userId={m.from_id}
                            message={m.content}
                            timestamp={m.created_at}
                            username={sendersInfo.current[m.from_id].username}
                            avatar={sendersInfo.current[m.from_id].avatar}
                            key={m.id}
                            id={m.id}
                            deleteMessage={deleteMessage}
                          />
                        ),
                    )}
                  </>
                )}
              </>
            )}
          </ScrollableFeed>
          <form onSubmit={sendMessage}>
            <div className={cx('input-container')}>
              <input
                className={cx('input')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Send a message to ${partner ? partner.name : ''}`}
              />
              <FontAwesomeIcon className={cx('icon')} type="submit" icon={faPaperPlane} onClick={sendMessage} />
            </div>
          </form>
        </div>
      ) : (
        <div>Not avaialble</div>
      )}
    </div>
  );
}

export default DirectMessage;
