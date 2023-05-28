import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./DirectMessageOption.module.scss";

const cx = classNames.bind(styles);

function DirectMessageOption({ title, id }) {
  // const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    //Funciton to get user information by id
    const getUserInfo = () => {
      // setUser(user);
    };
  }, []);

  //Fake user information
  const user = {
    useId: 1,
    name: "Alice",
    avatar: "https://avatars.githubusercontent.com/u/1234?v=4",
  };

  return (
    <Link 
      className={cx("wrapper")} 
      to={`?direct-message=${id}`}>
      <img className={cx("user-profile")} src={user.avatar} alt="" />
      <span className={cx("title")}>{title}</span>
    </Link>
  );
}

export default DirectMessageOption;