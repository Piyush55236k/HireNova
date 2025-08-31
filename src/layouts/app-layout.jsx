import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="grid-background"></div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
