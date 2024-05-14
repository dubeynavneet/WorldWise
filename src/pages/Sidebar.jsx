import styles from "./Sidebar.module.css";
import Logo from "../components/Logo";
import AppNav from "../components/AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      {/* Display the UI changes in components when part of URL changeg*/}
      <Outlet />
      <Footer />
    </div>
  );
}

export default Sidebar;
