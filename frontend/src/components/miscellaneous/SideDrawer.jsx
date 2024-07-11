import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from '@parthamk/notification-badge'
import NotificationBadge from "@parthamk/notification-badge/lib/components/NotificationBadge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const history = useNavigate();

  // console.log(user)
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something to search",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post('/api/chat', {userId}, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats])
      }

      setSelectedChat(data)
      setLoadingChat(false)
      onClose();
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

  // console.log(user);
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
        fontWeight={600}
      >
        <Tooltip label="Search Contact" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
          {" "}
          Chatsapp
        </Text>
        <div className="">
          <Menu>
            <MenuButton p={"1"}>
              <NotificationBadge
              count={notification.length}
              effect={
                Effect.SCALE
              }
              />
              <BellIcon fontSize={"2xl"} margin={"1px"} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {!notification.length && "No New Messages"}
              {
                notification.map((notif) => (
                  <MenuItem 
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat)
                    setNotification(notification.filter((n) => n !== notif))
                  }}
                  
                  >
                    {notif.chat.isGroupChat 
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message From ${getSender(user, notif.chat.users)}`
                    }
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.avatar}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <ProfileModal user={user}>
                <MenuItem onClick={logOutHandler}>Logout</MenuItem>
              </ProfileModal>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by Email or Name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={'flex'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
