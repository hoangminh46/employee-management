import { Fragment } from "react";
import { Outlet } from "react-router";

export default function BlankLayout() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
