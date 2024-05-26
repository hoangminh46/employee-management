import styles from "@/pages/NotFound/NotFound.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function NotFound() {
  return (
    <div className={cx("notfound")}>
      <div>Not Found</div>
    </div>
  );
}
