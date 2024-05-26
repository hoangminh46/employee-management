import styles from "@/pages/UserDashboard/UserDashboard.module.scss";
import classNames from "classnames/bind";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import { format, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addCheckin, addCheckout, getUsers } from "@/redux/usersSlice";
import { v4 as uuidv4 } from "uuid";

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

  const userAttendance = user?.attendance;
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const dispatch = useDispatch();

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
                  : "date-content date-half"
              }
            >
              <div>Công 8 - Muộn 0</div>
              <div>In: {item.checkIn ? item.checkIn : "N/A"}</div>
              <div>Out: {item.checkOut ? item.checkOut : "N/A"}</div>
            </div>
          ),
        };
      })
    );
  }, [userAttendance]);

  function handleCheckin() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const timeCheckin = {
      userId: userID,
      attendanceId: uuidv4(),
      day,
      month,
      year,
      checkIn: `${hours}:${minutes}:${seconds}`,
    };
    console.log(timeCheckin);
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
                  <div>Công 8 - Muộn 0</div>
                  <div>In: {item.checkIn}</div>
                  <div>Out: {item.checkOut}</div>
                </div>
              ),
            };
          })
        );
      })
      .catch((error) => {
        console.error("Error in handleCheckin:", error);
      });
  }

  function handleCheckout() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const day = currentDate.getDate();

    const currentID = user?.attendance?.find((item) => {
      return item.day === day;
    });

    console.log(currentID);

    const timeCheckout = {
      userId: userID,
      attendanceId: currentID.id,
      checkOut: `${hours}:${minutes}:${seconds}`,
    };
    dispatch(addCheckout(timeCheckout))
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
                  <div>Công 8 - Muộn 0</div>
                  <div>In: {item.checkIn}</div>
                  <div>Out: {item.checkOut}</div>
                </div>
              ),
            };
          })
        );
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
          <div className={cx("btn-checkin")} onClick={handleCheckin}>
            <LoginOutlined />
            Checkin
          </div>
          <div className={cx("btn-checkin")} onClick={handleCheckout}>
            <LogoutOutlined />
            Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
