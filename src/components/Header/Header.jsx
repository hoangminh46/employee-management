import styles from "@/components/Header/Header.module.scss";
import classNames from "classnames/bind";
import AmelaLogo from "../AmelaLogo/AmelaLogo";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { logout } from "@/redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "@/redux/usersSlice";

const cx = classNames.bind(styles);

export default function Header() {
  const userToken = localStorage.getItem("userToken");
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const decodedToken = userToken ? jwtDecode(userToken) : null;

  function handleLogout() {
    dispatch(logout());
    dispatch(logoutUser());
    navigateTo("/login");
  }
  return (
    <div className={cx("header")}>
      <div className={cx("header-content")}>
        <div className={cx("header-right")}>
          <AmelaLogo role={decodedToken?.role} />
          {decodedToken?.role === "user" ? (
            <div className={cx("member-link")}>
              <div className={cx("member-list")}>
                <NavLink
                  to="/user-dashboard"
                  className={({ isActive }) => (isActive ? "active-nav" : "")}
                >
                  Chấm công
                </NavLink>
              </div>
              <div className={cx("member-list")}>
                <NavLink
                  to="/member-list"
                  className={({ isActive }) => (isActive ? "active-nav" : "")}
                >
                  Thông tin member
                </NavLink>
              </div>
            </div>
          ) : null}
        </div>
        <div className={cx("header-left")}>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <div>
                      <Link to={`/profile/${decodedToken?.id}`}>
                        Thông tin cá nhân
                      </Link>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: <div onClick={handleLogout}>Đăng xuất</div>,
                },
              ],
            }}
          >
            <div className={cx("user-info")}>
              <UserOutlined className={cx("user-icon")} />
            </div>
          </Dropdown>
          <div className={cx("theme-btn")}></div>
        </div>
      </div>
    </div>
  );
}
