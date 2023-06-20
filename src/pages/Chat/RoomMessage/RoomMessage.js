/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ScrollableFeed from 'react-scrollable-feed';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import styles from './RoomMessage.module.scss';
import Message from '../../../components/Message/Message';
import chatAPI from '../../../api/chatAPI';
import userAPI from '../../../api/userAPI';
import authAPI from '../../../api/authAPI';
import chatRoomAPI from '../../../api/chatRoomAPI';

const cx = classNames.bind(styles);
const host = 'http://localhost:8080';
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

function RoomMessage({ roomMessageId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState();
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const sendersInfo = useRef({ length: 0 });
  // const [sendersInfo, setSendersInfo] = useState([]);
  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    setMessages([]);
    getMessageHistory();

    socketRef.current = socketIOClient.connect(host);
    socketRef.current.emit('c_pairID', { id: cookies.id, access_token: cookies.access_token });

    socketRef.current.on('s_roomMessage', (data) => {
      console.log(roomMessageId);
      console.log(data);
      if (roomMessageId == data.room_id) {
        const msg = {
          from_id: data.from_id,
          content: data.content,
          created_at: data.created_at,
          room_id: data.room_id,
        };

        console.log('Someone says: ', msg);

        setMessages((oldMsgs) => [...oldMsgs, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomMessageId]);

  const getMessageHistory = async () => {
    // if (res.status === 0) {
    //   authAPI.logout();
    //   navigate('login');
    // }

    setIsLoading(true);

    const roomRes = await chatRoomAPI.getRoom(roomMessageId);
    console.log(roomRes);
    if (roomRes) {
      setRoom(roomRes.data.room);
    }

    const historyChat = await chatRoomAPI.getMessages(roomMessageId);
    if (historyChat) {
      if (historyChat.data) {
        const historyMessages = historyChat.data.messages;
        console.log(historyMessages);
        for (let i = 0; i < historyMessages.length; i++) {
          const msg = {
            from_id: historyMessages[i].from_id,
            room_id: historyMessages[i].roomMessageId,
            content: historyMessages[i].message,
            created_at: historyMessages[i].created_at,
          };
          setMessages((oldMsgs) => [...oldMsgs, msg]);

          if (sendersInfo.current[msg.from_id] === undefined) {
            const newSender = await getUserInfo(msg.from_id);
            sendersInfo.current.length++;
            sendersInfo.current[msg.from_id] = newSender;
            console.log(sendersInfo.current);
          }
        }
      }
    }
    setIsLoading(false);
  };

  const getUserInfo = async (id) => {
    const res = await userAPI.getUserInfo(id);
    return {
      username: res.data.user.name,
      avatar: avatarBaseUrl + res.data.user.avatar,
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input !== null && input !== '') {
      const msg = {
        from_id: cookies.id,
        room_id: roomMessageId,
        content: input,
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socketRef.current.emit('c_roomMessage', msg);
      setInput('');
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('main')}>
        <div className={cx('channel-name')}>
          <p>{room ? room.name : ''}</p>
        </div>
        <ScrollableFeed className={cx('messages')} ref={messagesEnd}>
          {isLoading ? (
            <div className={cx('loading')}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <h3 className={cx('zero-message')}>{''}</h3>
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
                          key={index}
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
              placeholder={`Send a message to ${room ? room.name : ''}`}
            />
            <FontAwesomeIcon className={cx('icon')} type="submit" icon={faPaperPlane} onClick={sendMessage} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomMessage;
