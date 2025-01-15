import DashboardLayout from "../../layouts/DashboardLayout";
import Dashboard from "../../pages/Dashboard";
import Devices from "../../pages/Devices";
import CreateDevice from "../../pages/CreateDevice";
import DetailDevice from "../../pages/DetailDevice";

const dashboardRouter = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "devices",
      element: <Devices />,
    },
    { path: "devices/add", element: <CreateDevice /> },
    { path: "devices/:id", element: <DetailDevice /> },
  ],
};

export default dashboardRouter;
