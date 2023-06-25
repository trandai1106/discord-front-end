import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from "./CallModal.module.scss";
import * as Actions from "../../store/actions/index";
import store from '../../store/store';
import socket from '../../socket';

const cx = classNames.bind(styles);
const baseUrl = process.env.REACT_APP_SERVER_URL;

function CallModal(data) {
  const [cookies] = useCookies();
  console.log(data.data);

  const handleJoin = () => {
    window.open(baseUrl + "/call/" + data.data.call_id, '_blank', '_self');
    if (data.data.type === "directCall") {
      const msg = {
        from_id: cookies.id,
        to_id: data.data.from_id,
        content: "Joined call",
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit("c_directMessage", msg);
    } else {
      const msg = {
        from_id: cookies.id,
        room_id: data.data.room_id,
        content: "Joined call",
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit("c_roomMessage", msg);
    }
    store.dispatch(Actions.toggleCallModal(false));
  };

  const handleReject = () => {
    socket.emit("rejectCall", { from_id: cookies.id, to_id: data.data.from_id, call_id: data.data.call_id });
    if (data.data.type === "directCall") {
      const msg = {
        from_id: cookies.id,
        to_id: data.data.from_id,
        content: "Rejected call",
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit("c_directMessage", msg);
    } else {
      socket.emit("rejectCall", { from_id: cookies.id, room_id: data.data.room_id, call_id: data.data.call_id });
      const msg = {
        from_id: cookies.id,
        room_id: data.data.room_id,
        content: "Rejected call",
        access_token: cookies.access_token,
        created_at: Date.now(),
      };
      socket.emit("c_roomMessage", msg);
    }
    store.dispatch(Actions.toggleCallModal(false));
  };

  return (
    <div className={cx("overlay")}>
      <div className={cx("inner")}>
        <div className={cx("container")}>
          <div className={cx("header")}>You have a call from {data.data.from_name}</div>
          <div className={cx("content")}>
            <div className={cx("action")} onClick={handleReject}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className={cx("action", "oke")} onClick={handleJoin}>
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CallModal;