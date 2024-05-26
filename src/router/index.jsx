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

const checkUserRole = (role, path) => {
  if (role === "admin" && path === "/admin-dashboard") {
    return <AdminDashboard />;
  } else if (role === "user" && path === "/user-dashboard") {
    return <UserDashboard />;
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
          path: "profile/:ProfileId",
          element: <Profile />,
        },
      ],
    },
  ]);

  return <Fragment>{routes}</Fragment>;
}
