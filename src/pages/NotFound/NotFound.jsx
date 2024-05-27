import styles from "@/pages/NotFound/NotFound.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function NotFound() {
  return (
    <div className={cx("notfound")}>
      <div className={cx("content")}>
        <div>404</div>
        <div>Page Not Found</div>
      </div>
    </div>
  );
}
