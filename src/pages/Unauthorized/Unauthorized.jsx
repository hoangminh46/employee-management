import styles from "@/pages/Unauthorized/Unauthorized.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function Unauthorized() {
  return (
    <div className={cx("unauthorized")}>
      <div>unauthorized</div>
    </div>
  );
}
