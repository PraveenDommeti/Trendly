
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { ThemeToggle } from "./ThemeToggle";

const Layout = () => {
  return (
    <div className="mobile-container bg-background dark:bg-gray-900 min-h-screen max-w-md mx-auto border-x border-gray-200 dark:border-gray-700">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Layout;
