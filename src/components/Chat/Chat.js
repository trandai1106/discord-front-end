import React, { useState, useEffect, useRef } from "react";
import {BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import './Chat.css'

const host = "http://localhost:8080";

function Chat() {
  // console.log('searchParams');

  const { to_id } = useParams();
  console.log('my friend is ' + to_id);

  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.emit('c_pairID', { id: localStorage.getItem('id'), access_token: localStorage.getItem('token') });

    socketRef.current.on('s_directMessage', data => {
      console.log('Someone says: ' + data.content);
      setMess(oldMsgs => [...oldMsgs, data]);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null && message !== '') {
      const msg = {
        from_id: localStorage.getItem('id'),
        to_id: to_id,
        content: message, 
        access_token: localStorage.getItem('token')
      };
      socketRef.current.emit('c_directMessage', msg);
      setMess(oldMsgs => [...oldMsgs, msg]);
      setMessage('');
      scrollToBottom();
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
          {m.content}
        </div>
      )
    
  return (
      <div class="box-chat">
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