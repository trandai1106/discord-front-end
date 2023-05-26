import React, { useState, useEffect, useRef } from "react";
import {BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import './Chat.css'
import chatAPI from '../../api/chatAPI';
import userAPI from '../../api/userAPI';

const host = "http://localhost:8080";

function Chat() {
  // console.log('searchParams');

  const { to_id } = useParams();
  console.log('my friend is ' + to_id);

  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();
  var [partner, setPartner] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {

    getMessageHistory();
    // socket
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.emit('c_pairID', { id: localStorage.getItem('id'), access_token: localStorage.getItem('token') });

    socketRef.current.on('s_directMessage', data => {
      console.log('Someone says: ' + data.content);

      if (data.from_id == to_id) {
        setMess(oldMsgs => [...oldMsgs, data]);
        scrollToBottom();
      }
      if (data.from_id == localStorage.getItem('id')) {
        setMess(oldMsgs => [...oldMsgs, data]);
        scrollToBottom();
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getMessageHistory = async () => {
    const res = await userAPI.getUserInfo(to_id);
    if (res) {
      if (res.data) {
        if (res.data.data) {
          partner = res.data.data.user
          setPartner(partner);
        }
      }
    }
    console.log(await chatAPI.getMessages(to_id));

    const historyChat = await chatAPI.getMessages(to_id);
    if (historyChat) {
      if (historyChat.data) {
        if (historyChat.data.data) {
          console.log(historyChat.data.data.messages.length);
          
          for (var i = 0; i < historyChat.data.data.messages.length; i++) {
            console.log(i + " - " + historyChat.data.data.messages[i].from_id);
            const msg = {
              from_id: historyChat.data.data.messages[i].from_id,
              to_id: historyChat.data.data.messages[i].to_id,
              content: historyChat.data.data.messages[i].message,
              time: historyChat.data.data.messages[i].created_at
            };
            setMess(oldMsgs => [...oldMsgs, msg]);
          }
          scrollToBottom();
        }
      }
    }
  };

  const sendMessage = () => {
    if (message !== null && message !== '') {
      const msg = {
        from_id: localStorage.getItem('id'),
        to_id: to_id,
        content: message, 
        access_token: localStorage.getItem('token'),
        time: Date.now()
      };
      socketRef.current.emit('c_directMessage', msg);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }


  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMessage();
    }
  }
  
  const renderMess =  mess.map((m, index) => 
        <div key={index} className={`${m.from_id == localStorage.getItem('id') ? 'your-message' : 'other-people'} chat-item`}>
          {m.content + " " + new Date(m.time).toLocaleString()}
        </div>
      )
    
  return (
      <div class="box-chat">
        <div>Your id: {localStorage.getItem('id')}</div>
        <div>You are chatting with : {(partner != null && partner != undefined) ? partner.name + ' - id: ' + partner.id : ''}</div>
        <div class="box-chat-message">
            {renderMess}
            <div style={{ float:"left", clear: "both" }}
              ref={messagesEnd}>
            </div>
        </div>

        <div class="send-box">
            <textarea 
              class="input-text"
              value={message}  
              onKeyDown={onEnterPress}
              onChange={handleChange} 
              placeholder="Nhập tin nhắn ..." 
            />
            {/* <button class="send-button" onClick={sendMessage}>
              Send
            </button> */}
        </div>

      </div>  
  );
}

export default Chat;