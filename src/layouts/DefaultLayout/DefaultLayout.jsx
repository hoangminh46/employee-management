import Header from "@/components/Header/Header";
import { Fragment } from "react";
import { Outlet } from "react-router";

export default function DefaultLayout() {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
}
