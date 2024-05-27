import styles from "@/components/SearchBar/SearchBar.module.scss";
import { findUser } from "@/redux/usersSlice";
import classNames from "classnames/bind";
import { useState } from "react";
import { useDispatch } from "react-redux";

const cx = classNames.bind(styles);

export default function SearchBar() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
    dispatch(findUser(e.target.value));
  };

  return (
    <div className={cx("search-container")}>
      <input
        type="text"
        className={cx("search-bar")}
        placeholder="Tìm kiếm người dùng..."
        value={inputValue}
        onChange={handleChangeInput}
      />
      <svg
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cx("search-icon")}
      >
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
      </svg>
    </div>
  );
}
