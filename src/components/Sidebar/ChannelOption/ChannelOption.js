import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import styles from "./ChannelOption.module.scss";

const cx = classNames.bind(styles);

function ChannelOption({title, icon, id}) {
  return (
    <Link className={cx("wrapper")} to={`?channel=${id}`}>
      <div className={cx("icon")}>
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </div>
      <span className={cx("title")}>{title}</span>
    </Link>
  );
}

export default ChannelOption;