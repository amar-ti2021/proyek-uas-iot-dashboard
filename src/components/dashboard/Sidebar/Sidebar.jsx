import { Stack, Button, Link as ChakraLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsDeviceSsd } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import PropTypes from "prop-types";

const Sidebar = ({ isSidebarVisible, toggleSidebar, width, left }) => {
  const location = useLocation();
  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <RxDashboard /> },
    { path: "/devices", label: "Devices", icon: <BsDeviceSsd /> },
  ];

  return (
    <>
      <Stack
        spaceY={4}
        h={"100vh"}
        position="fixed"
        top={0}
        width={width}
        left={left}
        shadow={"xl"}
        bgColor={"white"}
        transition="left 0.5s ease-in-out"
        zIndex={9999}
      >
        <Button
          w={"5px"}
          top={"10px"}
          aspectRatio={"1/1"}
          position="relative"
          right="-100%"
          onClick={toggleSidebar}
          bgColor="green.700"
          color="white"
          _hover={{ bgColor: "green.800" }}
          zIndex={10}
          borderRadius="0 5px 5px 0"
        >
          {isSidebarVisible ? <FaChevronLeft /> : <FaChevronRight />}
        </Button>
        {links.map((link) => (
          <ChakraLink
            as={Link}
            to={link.path}
            key={link.path}
            fontSize={"16px"}
            marginX={8}
            display="flex"
            alignItems="center"
            gap={2}
            px={4}
            py={2}
            borderRadius="md"
            bgColor={
              location.pathname.startsWith(link.path)
                ? "green.200"
                : "transparent"
            }
            fontWeight={location.pathname === link.path ? "bold" : "regular"}
            _hover={{ bgColor: "green.300" }}
          >
            {link.icon}
            {link.label}
          </ChakraLink>
        ))}
      </Stack>
    </>
  );
};

Sidebar.propTypes = {
  isSidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  width: PropTypes.object.isRequired,
  left: PropTypes.object.isRequired,
};

export default Sidebar;
