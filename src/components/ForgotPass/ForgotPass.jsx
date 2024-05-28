import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/components/ForgotPass/ForgotPass.module.scss";
import classNames from "classnames/bind";
import { CaretLeftFilled, SyncOutlined } from "@ant-design/icons";
import { resetPass } from "@/redux/usersSlice";
import { Modal } from "antd";
import { useState } from "react";

const cx = classNames.bind(styles);

export default function ForgotPass({ onToggleForm }) {
  const messageForgot = useSelector((state) => state.users.forgotMessage);
  const isLoading = useSelector((state) => state.users.isLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
  });

  // Xử lý submit form
  const handleSubmit = (values) => {
    dispatch(resetPass(values)).then(() => {
      setIsModalOpen(true);
    });
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

          <button
            type="submit"
            className={cx("btn-login")}
            disabled={isLoading}
          >
            {isLoading ? (
              <SyncOutlined spin className={cx("spin-btn")} />
            ) : (
              <span>Xác nhận</span>
            )}
          </button>
          <div className={cx("back-login")} onClick={onToggleForm}>
            <CaretLeftFilled style={{ marginRight: "4px" }} /> Về trang đăng
            nhập
          </div>
        </Form>
      </Formik>
      <Modal
        open={isModalOpen}
        className="default-modal message-modal"
        footer={false}
        title="Thông báo"
      >
        <div className="message-content">
          <div className="message-title">{messageForgot?.message}</div>
          {messageForgot.type === 1 && (
            <div className="message-btn" onClick={() => setIsModalOpen(false)}>
              Xác nhận
            </div>
          )}
          {messageForgot.type === 2 && (
            <div
              className="message-btn"
              onClick={() => {
                onToggleForm();
                setIsModalOpen(false);
              }}
            >
              Xác nhận
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
