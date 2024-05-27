import styles from "@/pages/Profile/Profile.module.scss";
import { clearMessage, editUsers, getUsers } from "@/redux/usersSlice";
import { InfoCircleFilled } from "@ant-design/icons";
import classNames from "classnames/bind";
import { jwtDecode } from "jwt-decode";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Modal } from "antd";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Bounce, toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

export default function Profile() {
  const users = useSelector((state) => state.users.users);
  const messageFromStore = useSelector((state) => state.users.message);
  const userToken = localStorage.getItem("userToken");
  const userDecoded = userToken ? jwtDecode(userToken) : null;
  const dispatch = useDispatch();
  const { ProfileId } = useParams();
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Họ tên là bắt buộc!!!"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    username: Yup.string().required("Tên tài khoản là bắt buộc!!!"),
    password: Yup.string().required("Mật khẩu là bắt buộc!!!"),
    role: Yup.string().required("Quyền hạn là bắt buộc!!!"),
  });

  const currentUser = users.find((user) => {
    return user.id === ProfileId;
  });

  const handleEditUSer = (values) => {
    dispatch(editUsers(values))
      .then(() => {
        setIsModalOpenEdit(false);
      })
      .then(() => {
        dispatch(clearMessage());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useLayoutEffect(() => {
    if (messageFromStore.type === 1) {
      toast.error(`${messageFromStore.text}`, {
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
    } else if (messageFromStore.type === 2) {
      toast.success(`${messageFromStore.text}`, {
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
  }, [messageFromStore]);

  return (
    <div className={cx("profile")}>
      <div className={cx("wrapper")}>
        <div className={cx("title")}>
          <div className={cx("title-header")}>
            <InfoCircleFilled />
            {userDecoded.id === ProfileId
              ? `Thông tin cá nhân`
              : `Thông tin cá nhân của ${currentUser?.name}`}
          </div>
          {userDecoded.id === ProfileId ? (
            <div
              className={cx("edit-btn")}
              onClick={() => setIsModalOpenEdit(true)}
            >
              <svg
                stroke="#fea628"
                fill="#fea628"
                strokeWidth="0"
                viewBox="0 0 20 20"
                height="30px"
                width="30px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </div>
          ) : null}
        </div>
        <div className={cx("user-data", "no-color")}>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Họ và tên</div>
            <div className={cx("data-info")}>{currentUser?.name}</div>
          </div>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Giới tính</div>
            <div className={cx("data-info")}>
              {currentUser?.gender === "male"
                ? "Nam"
                : currentUser?.gender === "female"
                ? "Nữ"
                : ""}
            </div>
          </div>
        </div>
        <div className={cx("user-data", "color")}>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Email</div>
            <div className={cx("data-info")}>{currentUser?.email}</div>
          </div>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Số điện thoại</div>
            <div className={cx("data-info")}>{currentUser?.phone}</div>
          </div>
        </div>
        <div className={cx("user-data", "no-color")}>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Division</div>
            <div className={cx("data-info")}>{currentUser?.division}</div>
          </div>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Vị trí</div>
            <div className={cx("data-info")}>{currentUser?.position}</div>
          </div>
        </div>
        <div className={cx("user-data", "color")}>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Địa chỉ</div>
            <div className={cx("data-info")}>{currentUser?.address}</div>
          </div>
          <div className={cx("data-left")}>
            <div className={cx("data-title")}>Tình trạng hôn nhân</div>
            <div className={cx("data-info")}>
              {currentUser?.love === "alone"
                ? "Độc thân"
                : currentUser?.love === "married"
                ? "Đã kết hôn"
                : ""}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpenEdit}
        className="default-modal"
        footer={false}
        title="Sửa thông tin cá nhân"
      >
        <div className="default-modal-content">
          <Formik
            initialValues={currentUser}
            validationSchema={validationSchema}
            onSubmit={handleEditUSer}
            enableReinitialize
          >
            <Form>
              <div className="form-content">
                {/* name */}
                <div className="form-group">
                  <label htmlFor="name">Họ và tên</label>
                  <Field
                    type="name"
                    id="name"
                    name="name"
                    placeholder="Nhập họ tên..."
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Username */}
                <div className="form-group">
                  <label htmlFor="username">Tên tài khoản</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Nhập tên tài khoản..."
                    disabled
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-group">
                  {/* Email */}
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập Email..."
                    disabled
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Password */}
                <div className="form-group">
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
                    className="error-message"
                  />
                </div>
                {/* SDT */}
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Nhập số điện thoại..."
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Address */}
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ</label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Nhập địa chỉ..."
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* gender */}
                <div className="form-group">
                  <label htmlFor="gender">Giới tính</label>
                  <Field as="select" id="gender" name="gender">
                    <option value="" disabled>
                      Chọn giới tính...
                    </option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Love */}
                <div className="form-group">
                  <label htmlFor="love">Tình trạng hôn nhân</label>
                  <Field as="select" id="love" name="love">
                    <option value="" disabled>
                      Chọn mối quan hệ
                    </option>
                    <option value="alone">Độc thân</option>
                    <option value="married">Đã kết hôn</option>
                  </Field>
                  <ErrorMessage
                    name="love"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Role */}
                <div className="form-group">
                  <label htmlFor="role">Quyền hạn</label>
                  <Field as="select" id="role" name="role" disabled>
                    <option value="" disabled>
                      Chọn quyền hạn...
                    </option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* position */}
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <Field as="select" id="position" name="position" disabled>
                    <option value="" disabled>
                      Chọn position...
                    </option>
                    <option value="CEO">CEO</option>
                    <option value="Developer">Developer</option>
                    <option value="Tester">Tester</option>
                  </Field>
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Division */}
                <div className="form-group">
                  <label htmlFor="division">Division</label>
                  <Field as="select" id="division" name="division" disabled>
                    <option value="" disabled>
                      Chọn division...
                    </option>
                    <option value="Faderless">Faderless</option>
                    <option value="Hades">Hades</option>
                    <option value="Phoenix">Phoenix</option>
                    <option value="Warrior">Warrior</option>
                  </Field>
                  <ErrorMessage
                    name="division"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <div className="footer-modal">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpenEdit(false)}
                >
                  Huỷ
                </button>
                <button className="btn-save" type="submit">
                  Lưu
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
