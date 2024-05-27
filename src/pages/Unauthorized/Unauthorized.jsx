import styles from "@/pages/Unauthorized/Unauthorized.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function Unauthorized() {
  return (
    <div className={cx("notfound")}>
      <div className={cx("content")}>
        <div>Error</div>
        <div>Unauthorized</div>
      </div>
    </div>
  );
}
