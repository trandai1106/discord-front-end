/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ScrollableFeed from "react-scrollable-feed";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import uuid4 from "uuid4";

import styles from "./DirectMessage.module.scss";
import Message from "../../../components/Message/Message";
import chatAPI from "../../../api/chatAPI";
import userAPI from "../../../api/userAPI";
import authAPI from "../../../api/authAPI";
import socket from "../../../socket";
import store from "../../../store/store";

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_SERVER_URL;

function DirectMessage({ directMessageId }) {
  const myUser = store.getState().auth.user;
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partner, setPartner] = useState();
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const sendersInfo = useRef({ length: 0 });
  const messagesEnd = useRef();
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setMessages([]);
    getMessageHistory();
    setShowActions(false);

    socket.on("s_directMessage", (data) => {
      const msg = {
        from_id: data.from_id,
        content: data.content,
        created_at: new Date(),
        directMessageId: directMessageId,
      };

      if (data.from_id === directMessageId || data.from_id === cookies.id) {
        if (sendersInfo.current.length === 0) {
          getMessageHistory();
        } else {
          setMessages((oldMsgs) => [...oldMsgs, msg]);
        }
      }
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [directMessageId]);

  const getMessageHistory = async () => {
    setIsLoading(true);
    const res = await userAPI.getUserInfo(directMessageId);
    if (res.status === 0) {
      authAPI.logout();
      navigate("login");
    }
    if (res) {
      setPartner(res.data.user);
    }

    const historyChat = await chatAPI.getMessages(directMessageId);
    if (historyChat) {
      if (historyChat.data) {
        const historyMessages = historyChat.data.messages;
        for (let i = 0; i < historyMessages.length; i++) {
          const msg = {
            from_id: historyMessages[i].from_id,
            directMessageId: historyMessages[i].directMessageId,
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
    if (input !== null && input !== "") {
      const msg = {
        from_id: cookies.id,
        to_id: directMessageId,
        content: input,
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit("c_directMessage", msg);
      setInput("");
    }
  };

  const makeVideoCall = () => {
    const msg = {
      from_id: cookies.id,
      to_id: directMessageId,
      content: "Made a new call",
      access_token: cookies.access_token,
      created_at: Date.now(),
    };
    socket.emit("c_directMessage", msg);

    const callId = uuid4().toString();
    socket.emit("directCall", {
      call_id: callId,
      from_id: cookies.id,
      to_id: directMessageId,
      from_name: myUser.name,
    });
    const callWindow = window.open(baseUrl + "/call/" + callId, '_blank', '_self');

    socket.on("rejectedCall", (data) => {
      callWindow.close();
    });
  };

  const handleShowActions = () => {
    console.log(showActions);
    setShowActions(!showActions);
  };

  const renderActions = () => {
    return (
      <div className={cx("actions-container")}>
        <div className={cx("item")}>Delete chat</div>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("main")}>
        <div className={cx("channel-header")}>
          <div className={cx("channel-name")}>
            {partner ? partner.name : ""}
            <div className={cx("action")} onClick={handleShowActions} >
              <FontAwesomeIcon icon={showActions ? faChevronUp : faChevronDown} />
              {showActions && renderActions()}
            </div>
          </div>
          <div className={cx("call-icon")} onClick={makeVideoCall}>
            <FontAwesomeIcon icon={faPhone} />
          </div>
        </div>
        <ScrollableFeed className={cx("messages")} ref={messagesEnd}>
          {isLoading ? (
            <div className={cx("loading")}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <h3 className={cx("zero-message")}>Start chat with {partner.name}</h3>
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
          <div className={cx("input-container")}>
            <input
              className={cx("input")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Send a message to ${partner ? partner.name : ""}`}
            />
            <FontAwesomeIcon className={cx("icon")} type="submit" icon={faPaperPlane} onClick={sendMessage} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default DirectMessage;
