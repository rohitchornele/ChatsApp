import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  //   const [selectedUsers, setSelectedUsers] = useState([]);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already Added",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add someone!!",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "bottom",
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

        const {data} = await axios.put('/api/chat/groupadd', {
            chatId : selectedChat._id,
            userId : userToAdd._id,
        },
    config);

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false)

    } catch (error) {
        toast({
            title: "Error Occures",
            status: "warning",
            duration: "5000",
            isClosable: true,
            position: "bottom",
          });
          
          setLoading(false)
    }
  };

  const handleRemove = async (userToRemove) => {
     
      if (selectedChat.groupAdmin._id !== user._id && userToRemove._id === user._id) {
        toast({
          title: "Only Admin can remove someone!!",
          status: "error",
          duration: "5000",
          isClosable: true,
          position: "bottom",
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
  
          const {data} = await axios.put('/api/chat/groupremove', {
              chatId : selectedChat._id,
              userId : userToRemove._id,
          },
      config);

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
  
      setFetchAgain(!fetchAgain);
      setLoading(false)
  
      } catch (error) {
          toast({
              title: "Error Occures",
              status: "warning",
              duration: "5000",
              isClosable: true,
              position: "bottom",
            });
            
            setLoading(false)
      }
    };
  


  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occures",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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

    //   console.log(data);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} width={"100%"} flexWrap={"wrap"} p={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="New Group Chat Name"
                mb={2}
                pb={2}
                // value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                // isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default UpdateGroupChatModal;
