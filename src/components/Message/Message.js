import classNames from 'classnames/bind';

import styles from './Message.module.scss';
import store from '../../store/store';
import * as Actions from '../../store/actions/index';

const cx = classNames.bind(styles);

function Message({ id, message, timestamp, username, avatar, userId, deleteMessage }) {
  const myUser = store.getState().auth.user;

  const formattedDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const year = messageDate.getFullYear();
    const month = messageDate.getMonth();
    const date = messageDate.getDate();
    const hour = messageDate.getHours();
    const minute = messageDate.getMinutes();

    const today = new Date();
    const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) {
      return `Today at ${hour}:${minute}`;
    } else {
      return `${date}/${month}/${year} ${hour}:${minute}`;
    }
  };

  const handledShowUserProfile = () => {
    store.dispatch(
      Actions.showUserProfile({
        state: true,
        userId: userId,
      }),
    );
  };

  return (
    <div className={cx('message')}>
      <img src={avatar} alt="" />
      <div className={cx('content')}>
        <h4 className={cx('title')}>
          <div className={cx('username')} onClick={handledShowUserProfile}>
            {username ? username : '...'}
          </div>
          <div className={cx('message-timestamp')}>{formattedDate(timestamp)}</div>
          {myUser.id === userId && (
            <div
              className={cx('delete')}
              onClick={() => {
                deleteMessage(id);
              }}
            >
              delete
            </div>
          )}
        </h4>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
