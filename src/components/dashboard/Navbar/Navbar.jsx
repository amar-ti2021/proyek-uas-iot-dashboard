import { Flex, Text } from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../../ui/menu";
import { Avatar } from "../../ui/avatar";

const Navbar = () => {
  return (
    <Flex p={5} w={"100%"} shadow={"md"} justifyContent={"end"}>
      <MenuRoot positioning={{ placement: "bottom-end" }}>
        <MenuTrigger asChild>
          <Flex gap={2} alignItems={"center"}>
            <Text hideBelow={"md"}> Welcome, Muhammad Amar Dafi </Text>{" "}
            <Avatar />
          </Flex>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="logout">Logout</MenuItem>
        </MenuContent>
      </MenuRoot>
    </Flex>
  );
};

export default Navbar;
