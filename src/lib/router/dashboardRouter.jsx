import DashboardLayout from "../../layouts/DashboardLayout";
import Dashboard from "../../pages/Dashboard";
import Devices from "../../pages/Devices";

const dashboardRouter = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "devices",
      element: <Devices />,
    },
  ],
};

export default dashboardRouter;
