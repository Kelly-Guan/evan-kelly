import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/nav";

export default function Layout() {
  const location = useLocation();

  const showNavBar = location.pathname !== "/";

  return (
    <>
      {showNavBar && <NavBar />}
      <div className={showNavBar ? "pt-15" : ""}>
        <Outlet />
      </div>
    </>
  );
}
