import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"

import styles from "./Header.module.scss";
import Profile from "./Profile";

const cx = classNames.bind(styles);

function Header() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('input-container')}>
        <input className={cx('input')} type="text" placeholder="Search"></input>
        <FontAwesomeIcon className={cx('icon')} icon={faSearch}></FontAwesomeIcon>
      </div>
      <Profile />
    </div>
  );
}

export default Header;