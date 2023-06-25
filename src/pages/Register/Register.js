import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './Register.module.scss';
import authAPI from '../../api/authAPI';

const cx = classNames.bind(styles);

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 16 && password.indexOf(' ') === -1;
  };

  const isValidEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === '' || !isValidEmail(email)) {
      return;
    }

    if (username === '') {
      return;
    }

    if (!isValidPassword(password)) {
      alert('Password length must be 8 to 16 characters and not contain any space');
      return;
    }

    if (password !== confirmPassword) {
      alert('Please confirm your password');
      return;
    }

    const res = await authAPI.register({
      email: email,
      name: username,
      password: password,
    });

    if (res.status === 1) {
      navigate('/chat');
      window.location.reload();
    } else {
      alert(res.message);
    }
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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value === '') {
      e.target.placeholder = '* Please enter your username';
      e.target.parentNode.classList.add(cx('error'));
    } else {
      e.target.parentNode.classList.remove(cx('error'));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === '') {
      e.target.placeholder = '* Please enter your password';
      e.target.parentNode.classList.add(cx('error'));
    } else {
      e.target.parentNode.classList.remove(cx('error'));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === '') {
      e.target.placeholder = '* Please confirm your password';
      e.target.parentNode.classList.add(cx('error'));
    } else {
      e.target.parentNode.classList.remove(cx('error'));
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('inner')}>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faEnvelope} />
            <input type="text" value={email} onChange={handleEmailChange} placeholder="Email"></input>
          </div>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faUser} />
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username"></input>
          </div>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faKey} />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password"></input>
          </div>
          <div className={cx('input-container')}>
            <FontAwesomeIcon className={cx('input-icon')} icon={faKey} />
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
            ></input>
          </div>
          <div className={cx('btn-container')}>
            <button className={cx('btn', 'active')} type="submit">
              Register
            </button>
            <div className={cx('spread')}>Already have an account?</div>
            <button className={cx('btn')} onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
