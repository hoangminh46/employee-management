import styles from "@/components/AmelaLogo/AmelaLogo.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export default function AmelaLogo({ role }) {
  return (
    <div className={cx("site-brand")}>
      <Link to={role === "admin" ? "/admin-dashboard" : "/user-dashboard"}>
        <div title="AMELA Technology" className={cx("logo")}>
          <img
            src="https://amela.vn/wp-content/uploads/2021/08/logo.svg"
            alt="AMELA Technology"
            decoding="async"
          />
          <div className={cx("ani-bar-logo")}>
            <div className={cx("bar-ani", "el-short", "el-1")}></div>
            <div className={cx("bar-ani", "el-tall", "el-2")}></div>
            <div className={cx("bar-ani", "el-short", "el-3")}></div>
          </div>
        </div>
      </Link>
    </div>
  );
}
