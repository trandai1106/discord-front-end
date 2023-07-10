import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import styles from './Header.module.scss';
import Profile from './Profile/Profile';

const cx = classNames.bind(styles);

function Header() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSumbit = (e) => {
    if (inputValue.trim() === '') {
      navigate(`${location.pathname}`);
      return;
    } else {
      navigate(`${location.pathname}?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const getPlaceholder = (str) => {
    if (str.includes('channel-message')) {
      return 'messages';
    }
    if (str.includes('direct-message')) {
      return 'messages';
    }
    if (str.includes('allchannels')) {
      return 'channel';
    }
    if (str.includes('people')) {
      return 'people';
    }
    return '';
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('input-container')}>
        <input
          className={cx('input')}
          type="text"
          value={inputValue}
          placeholder={`Search ${getPlaceholder(location.pathname)}`}
          onChange={handleChangeInput}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleSumbit();
            }
          }}
        ></input>
        <FontAwesomeIcon className={cx('icon')} icon={faSearch} onClick={handleSumbit} />
      </div>
      <Profile />
    </div>
  );
}

export default Header;
