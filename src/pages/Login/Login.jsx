import AmelaLogo from "@/components/AmelaLogo/AmelaLogo";
import LoginForm from "@/components/LoginForm/LoginForm";
import styles from "@/pages/Login/Login.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ForgotPass from "@/components/ForgotPass/ForgotPass";

const cx = classNames.bind(styles);

export default function Login() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const userToken = localStorage.getItem("userToken");
  const navigateTo = useNavigate();
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const userRole = decodedToken?.role;

  const handleToggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  useEffect(() => {
    if (userToken) {
      if (userRole === "admin") {
        navigateTo("/admin-dashboard");
      } else if (userRole === "user") {
        navigateTo("/user-dashboard");
      }
    }
  }, [navigateTo, userToken, userRole]);

  return (
    <div className={cx("login")}>
      <video playsInline autoPlay muted loop>
        <source
          src="https://amela.vn/wp-content/uploads/2021/08/video_sp.webm"
          type="video/webm"
        />
        <source
          src="https://amela.vn/wp-content/uploads/2021/08/video_sp.mp4"
          type="video/mp4"
        />
      </video>
      <div className={cx("header")}>
        <AmelaLogo />
      </div>
      <div className={cx("content")}>
        {showLoginForm ? (
          <LoginForm onToggleForm={handleToggleForm} />
        ) : (
          <ForgotPass onToggleForm={handleToggleForm} />
        )}
      </div>
    </div>
  );
}
