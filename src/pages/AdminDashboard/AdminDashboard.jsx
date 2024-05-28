import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "@/pages/AdminDashboard/AdminDashboard.module.scss";
import moment from "moment";
import Select from "react-select";
import dayjs from "dayjs";
import {
  addUsers,
  clearMessage,
  deleteUser,
  editUsers,
  getUsers,
} from "@/redux/usersSlice";
import { DatePicker, Modal, Table, TimePicker } from "antd";
import classNames from "classnames/bind";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);

export default function AdminDashboard() {
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "",
      render: (_, __, index) => calculateSelectedIndex(index),
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="member-name">
          <Link to={`/profile/${record.id}`}>{text}</Link>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vị trí",
      key: "position",
      dataIndex: "position",
    },
    {
      title: "Division",
      key: "division",
      dataIndex: "division",
    },
    {
      title: "Quyền hạn",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div className={cx("item-action")}>
          <div
            className={cx("action-admin")}
            onClick={() => showModalEdit(record)}
          >
            <svg
              stroke="#4F46E5"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="2.2em"
              width="2.2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </div>
          <div
            className={cx("action-admin")}
            onClick={() => handleDeleteUser(record.id)}
          >
            <svg
              stroke="#EF4444"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="2.2em"
              width="2.2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
        </div>
      ),
    },
  ];
  const [userData, setUserData] = useState([]);
  const [currentPageSelected, setcurrentPageSelected] = useState(1);
  const [isModalOpenNew, setIsModalOpenNew] = useState(false);
  const [isModalOpenMess, setIsModalOpenMess] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const showModalNew = () => {
    setIsModalOpenNew(true);
  };

  const usersEmail = userData?.map((user) => {
    return {
      value: user.email,
      label: `${user.email} (${user.name})`,
    };
  });

  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const showModalEdit = (record) => {
    setIsModalOpenEdit(true);
    setSelectedUser(record);
  };

  const users = useSelector((state) => state.users.usersFind);
  const messageFromStore = useSelector((state) => state.users.message);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const userID = decodedToken?.id;
  const validationSchema = Yup.object({
    name: Yup.string().required("Họ tên là bắt buộc!!!"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    username: Yup.string().required("Tên tài khoản là bắt buộc!!!"),
    password: Yup.string().required("Mật khẩu là bắt buộc!!!"),
    role: Yup.string().required("Quyền hạn là bắt buộc!!!"),
    division: Yup.string().required("Division là bắt buộc!!!"),
    position: Yup.string().required("Vị trí là bắt buộc!!!"),
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const userList = users?.filter((item) => {
      return item.id !== userID;
    });
    setUserData(userList);
  }, [users, userID]);

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

  const handlePageSelectedChange = (page) => {
    setcurrentPageSelected(page);
  };

  const calculateSelectedIndex = (index) => {
    return (currentPageSelected - 1) * 5 + index + 1;
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
    toast.success("Xoá người dùng thành công!!!", {
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
  };

  const handleAddUSer = (values, { resetForm }) => {
    const newUser = {
      ...values,
      phone: "",
      address: "",
      love: "",
      gender: "",
      attendance: [],
    };
    dispatch(addUsers(newUser))
      .then(() => {
        setIsModalOpenNew(false);
      })
      .then(() => {
        dispatch(clearMessage());
      })
      .catch((error) => {
        console.error(error);
      });
    resetForm();
  };

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

  function handleSendMessage(values) {
    console.log(values);
  }

  return (
    <div className={cx("dashboard")}>
      <div className={cx("action")}>
        <div className={cx("title")}>Danh sách nhân viên</div>
        <div className={cx("side-action")}>
          <SearchBar />
          <div className={cx("btn-add")} onClick={showModalNew}>
            <svg
              stroke="#fff"
              fill="#fff"
              strokeWidth="0"
              viewBox="0 0 20 20"
              aria-hidden="true"
              height="2em"
              width="2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              ></path>
            </svg>

            <span>Thêm nhân viên</span>
          </div>
          <div
            className={cx("btn-add")}
            onClick={() => setIsModalOpenMess(true)}
          >
            <MessageOutlined style={{ color: "#fff", fontSize: "24px" }} />

            <span>Gửi tin nhắn</span>
          </div>
        </div>
      </div>
      <div className={cx("content")}>
        <Table
          columns={columns}
          dataSource={userData}
          rowKey="key"
          pagination={{
            position: ["bottomCenter"],
            current: currentPageSelected,
            pageSize: 5,
            onChange: handlePageSelectedChange,
          }}
          className="table-admin"
        />
      </div>
      <Modal
        open={isModalOpenNew}
        className="default-modal"
        footer={false}
        title="Thêm nhân viên"
      >
        <div className="default-modal-content">
          <Formik
            initialValues={{
              id: uuidv4(),
              email: "",
              name: "",
              username: "",
              password: "",
              role: "",
              division: "",
              position: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddUSer}
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
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>
                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập Email..."
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
                {/* Role */}
                <div className="form-group">
                  <label htmlFor="role">Quyền hạn</label>
                  <Field as="select" id="role" name="role">
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
                  <Field as="select" id="position" name="position">
                    <option value="" disabled>
                      Chọn position...
                    </option>
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
                  <Field as="select" id="division" name="division">
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
                  className="btn-cancel"
                  onClick={() => setIsModalOpenNew(false)}
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

      <Modal
        open={isModalOpenEdit}
        className="default-modal"
        footer={false}
        title="Sửa thông tin nhân viên"
      >
        <div className="default-modal-content">
          <Formik
            initialValues={selectedUser}
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
                {/* Role */}
                <div className="form-group">
                  <label htmlFor="role">Quyền hạn</label>
                  <Field as="select" id="role" name="role">
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
                  <Field as="select" id="position" name="position">
                    <option value="" disabled>
                      Chọn position...
                    </option>
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
                  <Field as="select" id="division" name="division">
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

      <Modal
        open={isModalOpenMess}
        className="default-modal mess-modal"
        footer={false}
        title="Gửi tin nhắn"
      >
        <div className="default-modal-content">
          <Formik
            initialValues={{
              message: "",
              usersListEmail: [],
              date: "",
              time: "",
            }}
            onSubmit={handleSendMessage}
          >
            {({ values, handleChange }) => (
              <Form>
                <div className="form-group">
                  <div className="form-title">Nhân viên nhận tin nhắn</div>
                  <Field
                    name="usersListEmail"
                    component={({ field, form }) => (
                      <Select
                        {...field}
                        name="usersListEmail"
                        options={usersEmail}
                        isMulti
                        onChange={(option) =>
                          form.setFieldValue("usersListEmail", option)
                        }
                      />
                    )}
                  />
                </div>
                <div className="form-group">
                  <div className="form-title">Nội dung tin nhắn</div>
                  <Field
                    as="textarea"
                    name="message"
                    rows="5"
                    placeholder="Nhập tin nhắn của bạn"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group">
                  <div className="form-title">Thời gian gửi tin nhắn</div>
                </div>
                <div className="form-picker">
                  <div>
                    <Field name="date">
                      {({ field, form }) => (
                        <DatePicker
                          value={field.value}
                          onChange={(date, dateString) =>
                            form.setFieldValue("date", date)
                          }
                          format="DD-MM-YYYY"
                          hasFeedback
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Field name="time">
                      {({ field, form }) => (
                        <TimePicker
                          value={field.value}
                          onChange={(time, dateString) =>
                            form.setFieldValue("time", time)
                          }
                          format="h:mm A"
                          hourStep={1}
                          minuteStep={5}
                          hasFeedback
                          use12Hours
                          name="time"
                          label="time"
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="footer-modal">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsModalOpenMess(false)}
                  >
                    Huỷ
                  </button>
                  <button className="btn-save" type="submit">
                    Lưu
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
