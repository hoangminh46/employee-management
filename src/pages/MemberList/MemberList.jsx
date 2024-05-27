import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "@/pages/MemberList/MemberList.module.scss";
import { getUsers } from "@/redux/usersSlice";
import { Table } from "antd";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export default function MemberList() {
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
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text, record) => (
        <p>{record.gender === "male" ? "Nam" : "Nữ"}</p>
      ),
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
  ];
  const [userData, setUserData] = useState([]);
  const [currentPageSelected, setcurrentPageSelected] = useState(1);

  const users = useSelector((state) => state.users.usersFind);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const userID = decodedToken?.id;

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const userList = users?.filter((item) => {
      return item.id !== userID;
    });
    setUserData(userList);
  }, [users, userID]);

  const handlePageSelectedChange = (page) => {
    setcurrentPageSelected(page);
  };

  const calculateSelectedIndex = (index) => {
    return (currentPageSelected - 1) * 5 + index + 1;
  };

  return (
    <div className={cx("dashboard")}>
      <div className={cx("action")}>
        <div className={cx("title")}>Danh sách member</div>
        <div className={cx("side-action")}>
          <SearchBar />
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
    </div>
  );
}
