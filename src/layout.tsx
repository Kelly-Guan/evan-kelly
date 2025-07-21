import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/nav";

export default function Layout() {
  const location = useLocation();
  
  // Don't show NavBar on the "/" route (App screen)
  const showNavBar = location.pathname !== "/";

  return (
    <>
      {showNavBar && <NavBar />}
      <div>
        <Outlet />
      </div>
    </>
  );
}
