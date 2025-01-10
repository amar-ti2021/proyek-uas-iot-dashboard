import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import { Container, Flex } from "@chakra-ui/react";

const DashboardLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const sidebarStyles = {
    width: {
      base: "80%",
      md: "30%",
      lg: "20%",
    },
    left: {
      base: isSidebarVisible ? 0 : "-80%",
      md: isSidebarVisible ? 0 : "-30%",
      lg: isSidebarVisible ? 0 : "-20%",
    },
  };

  return (
    <Flex>
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        width={sidebarStyles.width}
        left={sidebarStyles.left}
      />
      <Container
        position={"absolute"}
        width={{
          base: "100%",
          md: isSidebarVisible ? "70%" : "100%",
          lg: isSidebarVisible ? "80%" : "100%",
        }}
        left={{
          base: 0,
          md: isSidebarVisible ? "30%" : 0,
          lg: isSidebarVisible ? "20%" : 0,
        }}
        transition="left 0.5s ease-in-out"
      >
        <Outlet />
      </Container>
    </Flex>
  );
};
export default DashboardLayout;
