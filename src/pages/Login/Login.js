import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useDispatch } from "react-redux";

import styles from "./Login.module.scss";
import authAPI from '../../api/authAPI';

const cx = classNames.bind(styles);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === "" || password === "") {
      return;
    }

    const res = await authAPI.login({
      name: username,
      password: password
    });

    if (res.status === 1) {
      setCookie('access_token', res.data.access_token, { path: '/' });
      setCookie('refresh_token', res.data.refresh_token, { path: '/' });
      setCookie('id', res.data.id, { path: '/' });
      navigate("/chat");
    } else {
      alert(res.message);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value === "") {
      e.target.placeholder = "* Please enter your username";
      e.target.parentNode.classList.add(cx('error'));
    } else {
      e.target.parentNode.classList.remove(cx('error'));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      e.target.placeholder = "* Please enter your password";
      e.target.parentNode.classList.add(cx('error'));
    } else {
      e.target.parentNode.classList.remove(cx('error'));
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('inner')}>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faUser} />
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username"></input>
          </div>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faKey} />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password"></input>
          </div>
          <div className={cx('btn-container')}>
            <button className={cx('btn', 'active')} type="submit">Login</button>
            <div className={cx('spread')}>Not have an account yet?</div>
            <button className={cx('btn')} onClick={() => navigate("/register")}>Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;