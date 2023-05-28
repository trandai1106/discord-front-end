/* eslint-disable no-unused-expressions */
import classNames from "classnames/bind";

import styles from "./Chat.module.scss";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DirectMessage from "./DirectMessage";

const cx = classNames.bind(styles);

function Chat() {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('container')}>
        <Sidebar />
        <div className={cx('content')}>
          <DirectMessage />
        </div>
      </div>
    </div>
  );
}

export default Chat;