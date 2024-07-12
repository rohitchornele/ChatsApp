import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderComplete } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "../ScrollableChat";
import Lottie, {  } from 'react-lottie'
import animationData from '../../assets/typing.json'

import io from 'socket.io-client';

const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => ( setSocketConnected(true) ));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [])

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("")

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data])
      } catch (error) {

        toast({
          title: "Error Occured",
          description: "Failed to send the message",
          status: "error",
          duration: "5000",
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);

      // console.log(messages)
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);

    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the messages",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom",
      });
      
    }
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

  }, [selectedChat])

  console.log("notification = " , notification)
  
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        //give notification

        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }

      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })
  
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 5000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderComplete(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>

                <ScrollableChat messages={messages} />
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? 
              <>
              <Lottie
                options={defaultOptions}
                width={70}
                height={20}
                style={{ marginBottom:3,  marginLeft: 30}}
                />
              </> : <></>
              }
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Type a message..."
                onChange={typingHandler}
                value={newMessage}
                position={'static'}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} pb={3}>
            Click on a contact to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
