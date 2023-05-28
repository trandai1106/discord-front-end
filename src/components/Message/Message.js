import classNames from "classnames/bind";

import styles from "./Message.module.scss";
import userAPI from "../../api/userAPI";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function Message({ message, timestamp, userId }) {
  const [userName, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await userAPI.getUserInfo(userId);
      console.log(res.data.user);
      setUsername(res.data.user.name);
      setUserAvatar(res.data.user.avatar);
    };
    getUserInfo();
  }, []);

  const formattedDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const year = messageDate.getFullYear();
    const month = messageDate.getMonth();
    const date = messageDate.getDate();
    const hour = messageDate.getHours();
    const minute = messageDate.getMinutes();

    const today = new Date();
    const isToday = date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    if (isToday) {
      return `Today at ${hour}:${minute}`;
    }
    else {
      return `${date}/${month}/${year} ${hour}:${minute}`;
    }
  };

  return (
    <div className={cx("message")}>
      <img src={userAvatar} alt="" />
      <div className={cx("message-info")}>
        <h4>
          {userName}
          <span className={cx("message-timestamp")}>
            {formattedDate(timestamp)}
          </span>
        </h4>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
