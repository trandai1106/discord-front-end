/* eslint-disable no-unused-expressions */
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPhone, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ScrollableFeed from 'react-scrollable-feed';
import { Spin } from 'antd';
import uuid4 from "uuid4";

import styles from './RoomMessage.module.scss';
import Message from '../../../components/Message/Message';
import userAPI from '../../../api/userAPI';
import chatRoomAPI from '../../../api/chatRoomAPI';
import socket from '../../../socket';
import store from '../../../store/store';
import chatAPI from '../../../api/chatAPI';
import * as Actions from "../../../store/actions/index";

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_SERVER_URL;

function RoomMessage({ roomMessageId }) {
  const myUser = store.getState().auth.user;
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState();
  const [cookies] = useCookies();
  const sendersInfo = useRef({ length: 0 });
  const messagesEnd = useRef();
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setMessages([]);
    getMessageHistory();
    setShowActions(false);

    const handleMessage = (data) => {
      if (roomMessageId === data.room_id) {
        const msg = {
          id: data._id,
          from_id: data.from_id,
          content: data.content,
          created_at: data.created_at,
          room_id: data.room_id,
        };

        if (data.room_id === roomMessageId) {
          setMessages((oldMsgs) => [...oldMsgs, msg]);
        }
      }
    }

    socket.on('s_roomMessage', handleMessage);

    socket.on("deleteRoomMessage", (data) => {
      console.log(data);
      setMessages(oldMsgs => oldMsgs.filter(msg => msg.id !== data.msg_id));
    });

    return () => {
      socket.off("s_roomMessage", handleMessage);
    };
  }, [roomMessageId]);

  const getMessageHistory = async () => {
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
        for (let i = 0; i < historyMessages.length; i++) {
          const msg = {
            id: historyMessages[i]._id,
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
      avatar: baseUrl + res.data.user.avatar,
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
      socket.emit('c_roomMessage', msg);
      setInput('');
    }
  };

  const makeVideoCall = () => {
    const msg = {
      from_id: myUser.id,
      room_id: roomMessageId,
      content: "Made a new call",
      access_token: cookies.access_token,
      created_at: Date.now(),
    };
    socket.emit("c_roomMessage", msg);

    const callId = uuid4().toString();
    socket.emit("roomCall", {
      call_id: callId,
      from_id: myUser.id,
      room_id: roomMessageId,
      from_name: room.name,
    });
    window.open(baseUrl + "/call/" + callId, '_blank', '_self');
  };

  const handleShowActions = () => {
    console.log(showActions);
    setShowActions(!showActions);
  };

  const handleShowGroupMembersModal = () => {
    store.dispatch(Actions.showGroupMembersModal({
      state: true,
      groupId: roomMessageId
    }));
  }

  const renderActions = () => {
    return (
      <div className={cx("actions-container")}>
        <div className={cx("item")} onClick={handleShowGroupMembersModal}>Members</div>
        <div className={cx("item")}>Leave chat</div>
      </div>
    );
  };

  const deleteMessage = async (id) => {
    const res = await chatAPI.deleteRoomMessage(id);
    if (res.status === 1) {
      setMessages(oldMsgs => oldMsgs.filter(msg => msg.id !== id));
      socket.emit("deleteRoomMessage", ({ from_id: cookies.id, room_id: roomMessageId, msg_id: id }));
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('main')}>
        <div className={cx("channel-header")}>
          <div className={cx("channel-name")}>
            {room ? room.name : ""}
            <div className={cx("action")} onClick={handleShowActions} >
              <FontAwesomeIcon icon={showActions ? faChevronUp : faChevronDown} />
              {showActions && renderActions()}
            </div>
          </div>
          <div className={cx("call-icon")} onClick={makeVideoCall}>
            <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
          </div>
        </div>
        <ScrollableFeed className={cx('messages')} ref={messagesEnd}>
          {isLoading ? (
            <div className={cx('loading')}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <h3 className={cx('zero-message')}>Start chat with others in {room.name}</h3>
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
