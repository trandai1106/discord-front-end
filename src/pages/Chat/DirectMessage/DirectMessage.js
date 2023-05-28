/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";
import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import styles from "./DirectMessage.module.scss";
import Message from "../../../components/Message";
import chatAPI from '../../../api/chatAPI';
import userAPI from '../../../api/userAPI';

const cx = classNames.bind(styles);
const host = "http://localhost:8080";

function DirectMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  const directMessageId = urlParams.get('direct-message');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [partner, setPartner] = useState();
  const [cookies, setCookies] = useCookies();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    getMessageHistory();
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.emit('c_pairID', { id: cookies.id, access_token: cookies.access_token });

    socketRef.current.on('s_directMessage', data => {
      console.log('Someone says: ' + data.content);

      if (data.from_id == directMessageId) {
        setMessages(oldMsgs => [...oldMsgs, data]);
        scrollToBottom();
      }
      if (data.from_id == cookies.id) {
        setMessages(oldMsgs => [...oldMsgs, data]);
        scrollToBottom();
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getMessageHistory = async () => {
    const res = await userAPI.getUserInfo(directMessageId);
    if (res) {
      console.log(res.data.user);
      setPartner(res.data.user);
    }

    const historyChat = await chatAPI.getMessages(directMessageId);
    if (historyChat) {
      if (historyChat.data) {
        for (let i = 0; i < historyChat.data.messages.length; i++) {
          const msg = {
            from_id: historyChat.data.messages[i].from_id,
            directMessageId: historyChat.data.messages[i].directMessageId,
            content: historyChat.data.messages[i].message,
            time: historyChat.data.messages[i].created_at
          };
          setMessages(oldMsgs => [...oldMsgs, msg]);
        }
        scrollToBottom();
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input !== null && input !== '') {
      const msg = {
        from_id: cookies.id,
        to_id: directMessageId,
        content: input,
        access_token: cookies.access_token,
        time: Date.now()
      };
      socketRef.current.emit('c_directMessage', msg);
      setInput('');
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('main')}>
        <div className={cx('channel-name')}>
          <p>{partner ? partner.name : ''}</p>
        </div>
        <div
          className={cx('messages')}
          ref={messagesEnd}
        >
          {messages.map((m, index) => (
            <Message
              message={m.content}
              timestamp={m.time.toLocaleString()}
              userId={m.from_id}
              key={index}
            />
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <div className={cx('input-container')}>
            <input
              className={cx('input')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Send a message to #${partner ? partner.name : ''}`}
            />
            <FontAwesomeIcon
              className={cx('icon')}
              type="submit"
              icon={faPaperPlane}
              onClick={sendMessage}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default DirectMessage;