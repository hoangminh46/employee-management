import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/components/ForgotPass/ForgotPass.module.scss";
import classNames from "classnames/bind";
import { CaretLeftFilled } from "@ant-design/icons";

const cx = classNames.bind(styles);

export default function ForgotPass({ onToggleForm }) {
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
  });

  // Xử lý submit form
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className={cx("login-form")}>
      <h2>Quên mật khẩu</h2>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={cx("form-group")}>
            <Field
              type="text"
              id="email"
              name="email"
              placeholder="Nhập email của bạn..."
            />
            <ErrorMessage
              name="email"
              component="div"
              className={cx("error-message")}
            />
          </div>

          <button type="submit" className={cx("btn-login")}>
            Reset mật khẩu
          </button>
          <div className={cx("back-login")} onClick={onToggleForm}>
            <CaretLeftFilled style={{ marginRight: "4px" }} /> Về trang đăng
            nhập
          </div>
        </Form>
      </Formik>
    </div>
  );
}
