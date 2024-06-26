import styles from "@/pages/UserDashboard/UserDashboard.module.scss";
import classNames from "classnames/bind";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import { format, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  addCheckin,
  addCheckout,
  addTotalTime,
  getUsers,
} from "@/redux/usersSlice";
import { v4 as uuidv4 } from "uuid";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import { NavLink } from "react-router-dom";

const messages = {
  allDay: "Cả ngày",
  previous: "Tháng trước",
  next: "Tháng sau",
  today: "Hôm nay",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Lịch",
  Monday: "Thứ 2",

  date: (date) => format(date, "dd/MM/yyyy", { locale: vi }),
  time: (date) => format(date, "HH:mm", { locale: vi }),
  eventTimeRangeFormat: ({ start, end }) =>
    `${format(start, "HH:mm", { locale: vi })} - ${format(end, "HH:mm", {
      locale: vi,
    })}`,
  eventTimeRangeStartFormat: (date) => format(date, "HH:mm", { locale: vi }),
  eventTimeRangeEndFormat: (date) => format(date, "HH:mm", { locale: vi }),
  weekStartsOn: (date) => getDay(startOfWeek(date, { locale: vi })),
};

const cx = classNames.bind(styles);

const localizer = momentLocalizer(moment);
moment.locale("vi");

export default function UserDashboard() {
  const userToken = localStorage.getItem("userToken");
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const usersData = useSelector((state) => state.users.usersFind);
  const userID = decodedToken?.id;
  const user = usersData.find((user) => {
    return user.id === userID;
  });
  const dateToday = new Date().getDate();
  const currMonth = new Date().getMonth() + 1;
  const currentID = user?.attendance?.find((item) => {
    return item.day === dateToday;
  });

  const userAttendance = user?.attendance;

  let totalPerMonth = userAttendance?.reduce((acc, item) => {
    if (item.month === currMonth) {
      return acc + Number((item.total / 60).toFixed(1));
    }
    return acc;
  }, 0);

  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    setTotalWorkingHours(workingDays * 8);
  }, []);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setEvents(
      userAttendance?.map((item) => {
        return {
          start: new Date(item.year, item.month - 1, item.day),
          end: new Date(item.year, item.month - 1, item.day),
          title: (
            <div
              className={
                item.checkIn && item.checkOut
                  ? "date-content date-full"
                  : item.checkIn || item.checkOut
                  ? "date-content date-half"
                  : "date-content date-none"
              }
            >
              <div>Công: {(item.total / 60).toFixed(1)}</div>
              <div className="check-status">
                {item.checkIn ? (
                  <CheckCircleFilled
                    style={{
                      color: "#2F852D",
                      marginRight: "4px",
                    }}
                  />
                ) : (
                  <CloseCircleFilled
                    style={{ color: "#E74C3C", marginRight: "4px" }}
                  />
                )}
                In: {item.checkIn ? item.checkIn : "N/A"}
              </div>
              <div className="check-status">
                {item.checkOut ? (
                  <CheckCircleFilled
                    style={{ color: "#2F852D", marginRight: "4px" }}
                  />
                ) : (
                  <CloseCircleFilled
                    style={{ color: "#E74C3C", marginRight: "4px" }}
                  />
                )}
                Out: {item.checkOut ? item.checkOut : "N/A"}
              </div>
            </div>
          ),
        };
      })
    );
  }, [userAttendance]);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCheckin() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const timeCheckin = {
      userId: userID,
      attendanceId: uuidv4(),
      day,
      month,
      year,
      checkIn: `${hours}:${minutes}`,
    };
    dispatch(addCheckin(timeCheckin))
      .then(() => {
        dispatch(getUsers());
      })
      .then(() => {
        setEvents(
          userAttendance.map((item) => {
            return {
              start: new Date(item.year, item.month, item.day),
              end: new Date(item.year, item.month, item.day),
              title: (
                <div className="date-content">
                  <div>Công: {(item.total / 60).toFixed(1)}</div>
                  <div className="check-status">
                    {item.checkIn ? (
                      <CheckCircleFilled
                        style={{ color: "#2F852D", marginRight: "4px" }}
                      />
                    ) : (
                      <CloseCircleFilled
                        style={{ color: "#E74C3C", marginRight: "4px" }}
                      />
                    )}
                    In: {item.checkIn ? item.checkIn : "N/A"}
                  </div>
                  <div className="check-status">
                    {item.checkOut ? (
                      <CheckCircleFilled
                        style={{ color: "#2F852D", marginRight: "4px" }}
                      />
                    ) : (
                      <CloseCircleFilled
                        style={{ color: "#E74C3C", marginRight: "4px" }}
                      />
                    )}
                    Out: {item.checkOut ? item.checkOut : "N/A"}
                  </div>
                </div>
              ),
            };
          })
        );
      })
      .then(() => {
        toast.success("Check-in thành công !!!", {
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
      })
      .catch((error) => {
        console.error("Error in handleCheckin:", error);
      });
  }

  function handleCheckout() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const timeCheckout = {
      userId: userID,
      attendanceId: currentID.id,
      checkOut: `${hours}:${minutes}`,
    };
    dispatch(addCheckout(timeCheckout))
      .then(() => {
        return Promise.all([
          dispatch(
            addTotalTime({ userId: userID, attendanceId: currentID.id })
          ),
        ]);
      })
      .then(() => {
        dispatch(getUsers());
      })
      .then(() => {
        setEvents(
          userAttendance.map((item) => {
            return {
              start: new Date(item.year, item.month, item.day),
              end: new Date(item.year, item.month, item.day),
              title: (
                <div className="date-content">
                  <div>Công: {(item.total / 60).toFixed(1)}</div>
                  <div className="check-status">
                    {item.checkIn ? (
                      <CheckCircleFilled
                        style={{ color: "#2F852D", marginRight: "4px" }}
                      />
                    ) : (
                      <CloseCircleFilled
                        style={{ color: "#E74C3C", marginRight: "4px" }}
                      />
                    )}
                    In: {item.checkIn ? item.checkIn : "N/A"}
                  </div>
                  <div className="check-status">
                    {item.checkOut ? (
                      <CheckCircleFilled
                        style={{ color: "#2F852D", marginRight: "4px" }}
                      />
                    ) : (
                      <CloseCircleFilled
                        style={{ color: "#E74C3C", marginRight: "4px" }}
                      />
                    )}
                    Out: {item.checkOut ? item.checkOut : "N/A"}
                  </div>
                </div>
              ),
            };
          })
        );
      })
      .then(() => {
        setIsModalOpen(false);
      })
      .then(() => {
        toast.success("Check-out thành công !!!", {
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
      })
      .catch((error) => {
        console.error("Error in handleCheckin:", error);
      });
  }

  return (
    <div className={cx("dashboard")}>
      <Calendar
        localizer={localizer}
        events={events}
        messages={messages}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      <div className={cx("right-content")}>
        <div className={cx("true-time")}>
          <img
            className={cx("time-img")}
            src="https://me.amela.vn/static/media/background-time-sheet.61660031.svg"
            alt=""
          />
          <div className={cx("time-header")}>Ca làm chuẩn</div>
          <div className={cx("time-title")}>
            <div className={cx("first-time")}>
              <img
                src="https://me.amela.vn/static/media/sun.9bae88fd.svg"
                alt="sun-icon"
              />
              08:00 - 12:00
            </div>
            <div className={cx("second-time")}>
              <img
                src="https://me.amela.vn/static/media/after-noon.42e1dbd9.svg"
                alt="after-noon-icon"
              />
              13:30 - 17:30
            </div>
          </div>
        </div>
        <div className={cx("check-daily")}>
          <div className={cx("daily-title")}>
            <img
              src="https://me.amela.vn/static/media/calendar-dayoff.bdc968a4.svg"
              alt=""
            />
            <p>Chấm công hàng ngày</p>
          </div>
          <p className={cx("time-today")}>Hôm nay: {currentTime}</p>
          {currentID?.checkIn ? null : (
            <div className={cx("btn-checkin")} onClick={handleCheckin}>
              <LoginOutlined />
              Checkin
            </div>
          )}
          {currentID?.checkIn &&
          currentID?.checkOut ? null : currentID?.checkIn ? (
            <div className={cx("btn-checkin")} onClick={handleOpenModal}>
              <LogoutOutlined />
              Checkout
            </div>
          ) : null}
          {currentID?.checkIn && currentID?.checkOut ? (
            <div className={cx("btn-checked")}>Đã chấm công</div>
          ) : null}
        </div>
        <div className={cx("total-time")}>
          <div className={cx("total-detail")}>
            <div className={cx("detail-left")}>
              <img
                src="https://me.amela.vn/static/media/docs-icon.d0339783.svg"
                alt=""
                style={{ marginRight: "4px" }}
              />
              Tổng số công
            </div>
            <div style={{ fontWeight: "600" }}>
              {totalPerMonth?.toFixed(1)}/{totalWorkingHours}
            </div>
          </div>
        </div>
      </div>
      {decodedToken?.role === "user" ? (
        <div className={cx("member-link", "mobile-link")}>
          <div className={cx("member-list")}>
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) => (isActive ? "active-mobile" : "")}
            >
              Chấm công
            </NavLink>
          </div>
          <div className={cx("member-list")}>
            <NavLink
              to="/member-list"
              className={({ isActive }) => (isActive ? "active-mobile" : "")}
            >
              Thông tin member
            </NavLink>
          </div>
        </div>
      ) : null}
      <Modal
        open={isModalOpen}
        className="default-modal confirm-modal"
        footer={false}
        title="Bạn có chắc chắn muốn Check-out không?"
      >
        <div className="confirm-content">
          <div className="btn-cancel" onClick={() => setIsModalOpen(false)}>
            Huỷ
          </div>
          <div className="btn-confirm" onClick={handleCheckout}>
            Xác nhận
          </div>
        </div>
      </Modal>
    </div>
  );
}
