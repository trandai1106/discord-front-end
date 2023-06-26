import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";
import Profile from "./Profile/Profile";

const cx = classNames.bind(styles);

function Header() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleSumbit = (e) => {
    if (inputValue.trim() === '') {
      return;
    }
    else {
      navigate(`/chat?q=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('input-container')}>
        <input
          className={cx('input')}
          type="text"
          value={inputValue}
          placeholder="Search"
          onChange={handleChangeInput}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleSumbit();
            }
          }}
        >
        </input>
        <FontAwesomeIcon
          className={cx('icon')}
          icon={faSearch}
          onClick={handleSumbit}
        />
      </div>
      <Profile />
    </div>
  );
}

export default Header;