import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentications/Login";
import Signup from "../components/authentications/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

  const history = useNavigate();

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (user) {
          history("/chats")
      }
  }, [history])


  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          display={"flex"}
          justifyContent={"center"}
          p={3}
          bg="white"
          w="100%"
          m="20px 0 10px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize={"3xl"} color={"black"} fontWeight={600}>
            Chatsapp
          </Text>
        </Box>

        <Box
          bg={"white"}
          width={"100%"}
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded">
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Log In</Tab>
              <Tab width={"50%"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
