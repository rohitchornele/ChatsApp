import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../context/ChatProvider';
import SingleChat from './userAvatar/SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const { selectedChat } = ChatState();

  return (
    <>
    <Box
    display={{base: selectedChat ? "flex" : "none", md: "flex" }}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={'white'}
    width={{base: "100%", md: "69%"}}
    borderRadius={'lg'}
    borderWidth={'1px'}
    >
      <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
    </>
  )
}

export default ChatBox