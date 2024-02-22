import Logo from "./Logo";
import AppNav from "./AppNav";
import style from "./Sidebar.module.css";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className={style.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />
      <Footer />
    </div>
  );
};

export default Sidebar;
