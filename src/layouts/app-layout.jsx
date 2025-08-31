import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import DatabaseStatus from "@/components/DatabaseStatus";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="grid-background"></div>
      <Header />
      <main>
        <Outlet />
      </main>
      <DatabaseStatus />
    </div>
  );
};

export default AppLayout;
