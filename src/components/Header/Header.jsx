import styles from "@/components/Header/Header.module.scss";
import classNames from "classnames/bind";
import AmelaLogo from "../AmelaLogo/AmelaLogo";
import { Link, useNavigate } from "react-router-dom";
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
        <AmelaLogo role={decodedToken.role} />
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
