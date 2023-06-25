import classNames from "classnames/bind";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';

import styles from "./Login.module.scss";
import authAPI from '../../api/authAPI';

const cx = classNames.bind(styles);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === "" || password === "") {
      return;
    }

    const res = await authAPI.login({
      email: email,
      password: password
    });

    if (res.status === 1) {
      navigate("/chat");
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const isValidEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      e.target.placeholder = "Please enter your email";
      e.target.parentNode.classList.add(cx('error'));
    } else if (!isValidEmail(e.target.value)) {
      e.target.placeholder = "Please enter a vaild email";
      e.target.parentNode.classList.add(cx('error'));
    }
    else {
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
            <FontAwesomeIcon className={cx('input-icon')} icon={faEnvelope} />
            <input type="text" value={email} onChange={handleEmailChange} placeholder="Email"></input>
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