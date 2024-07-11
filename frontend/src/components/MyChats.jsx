import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./miscellaneous/ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the chat",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: (selectedChat ? "none" : "flex"), md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        background={"white"}
        width={{ base: "100%", md: "30%" }}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        <Box
          display={"flex"}
          pb={3}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          borderRadius={"lg"}
          fontSize={{ base: "28px", md: "30px" }}
        >
          My Chats
          <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            >
            New Group Chat
          </Button>
          </GroupChatModal>
        </Box>

        <Box
          display={"flex"}
          flexDir={"column"}
          p={3}
          width={"100%"}
          h={"100%"}
          bg={"#F8F8F8"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
