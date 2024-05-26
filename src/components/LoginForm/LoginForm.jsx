import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "@/components/LoginForm/LoginForm.module.scss";
import classNames from "classnames/bind";
import { userLogin } from "@/redux/authSlice";
import { useEffect } from "react";

const cx = classNames.bind(styles);

export default function LoginForm() {
  const { userToken, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const validationSchema = Yup.object({
    username: Yup.string().required("Tên tài khoản là bắt buộc!!!"),
    password: Yup.string().required("Mật khẩu là bắt buộc!!!"),
  });
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const userRole = decodedToken?.role;

  useEffect(() => {
    if (userToken) {
      if (userRole === "admin") {
        navigateTo("/admin-dashboard");
      } else if (userRole === "user") {
        navigateTo("/user-dashboard");
      }
    }
  }, [navigateTo, userToken, userRole]);

  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [error]);

  // Xử lý submit form
  const handleSubmit = (values) => {
    dispatch(userLogin(values));
  };

  return (
    <div className={cx("login-form")}>
      <h2>Login</h2>
      <h3>Welcome back!</h3>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={cx("form-group")}>
            <label htmlFor="username">Tên tài khoản</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên tài khoản..."
            />
            <ErrorMessage
              name="username"
              component="div"
              className={cx("error-message")}
            />
          </div>

          <div className={cx("form-group")}>
            <label htmlFor="password">Mật khẩu</label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              autoComplete="on"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={cx("error-message")}
            />
          </div>
          <p className={cx("forgot-pass")}>Quên mật khẩu?</p>

          <button type="submit" className={cx("btn-login")}>
            Đăng nhập
          </button>
        </Form>
      </Formik>
    </div>
  );
}
