import { useRoutes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import Login from "@/pages/Login/Login";
import BlankLayout from "@/layouts/BlankLayout/BlankLayout";
import { Fragment } from "react";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard";
import Unauthorized from "@/pages/Unauthorized/Unauthorized";
import UserDashboard from "@/pages/UserDashboard/UserDashboard";
import NotFound from "@/pages/NotFound/NotFound";
import Profile from "@/pages/Profile/Profile";
import MemberList from "@/pages/MemberList/MemberList";

const checkUserRole = (role, path) => {
  if (role === "admin" && path === "/admin-dashboard") {
    return <AdminDashboard />;
  } else if (role === "user" && path === "/user-dashboard") {
    return <UserDashboard />;
  } else if (role === "user" && path === "/member-list") {
    return <MemberList />;
  } else if (
    (role === "user" && path === "/profile/:ProfileId") ||
    (role === "admin" && path === "/profile/:ProfileId")
  ) {
    return <Profile />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default function Routes() {
  const userToken = localStorage.getItem("userToken");
  const decodedToken = userToken ? jwtDecode(userToken) : null;
  const userRole = decodedToken?.role;

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate to="/login" />,
    },
    {
      path: "/",
      element: <BlankLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "/unauthorized",
          element: <Unauthorized />,
        },
        {
          path: "/*",
          element: <NotFound />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "admin-dashboard",
          element: checkUserRole(userRole, "/admin-dashboard"),
        },
        {
          path: "user-dashboard",
          element: checkUserRole(userRole, "/user-dashboard"),
        },
        {
          path: "member-list",
          element: checkUserRole(userRole, "/member-list"),
        },
        {
          path: "profile/:ProfileId",
          element: checkUserRole(userRole, "/profile/:ProfileId"),
        },
      ],
    },
  ]);

  return <Fragment>{routes}</Fragment>;
}
