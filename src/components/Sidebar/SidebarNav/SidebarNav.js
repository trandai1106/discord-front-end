import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./SidebarNav.module.scss";

const cx = classNames.bind(styles);

function SidebarNav({title, icon, onClick}) {
  return (
    <div className={cx("wrapper")} onClick={onClick}>
      <div className={cx("icon")}>
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </div>
      <strong className={cx("title")}>{title}</strong>
    </div>
  );
}

export default SidebarNav;