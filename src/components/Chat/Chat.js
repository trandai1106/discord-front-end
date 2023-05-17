import React, { useState, useEffect, useRef } from "react";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import socketIOClient from "socket.io-client";
import './Chat.css'

const host = "http://localhost:8080";

function Chat() {
  // console.log('searchParams');

  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
  
    socketRef.current.on('set-socket-id', data => {
        console.log('my id is ' + data);
        setId(data);
    });

    socketRef.current.on('server-send-data', data => {
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
        content: message, 
        access_token: localStorage.getItem('token')
      };
      socketRef.current.emit('client-send-data', msg);
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
        <div key={index} className={`${m.sender_id === localStorage.getItem('id') ? 'your-message' : 'other-people'} chat-item`}>
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