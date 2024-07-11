import React from 'react'
// import { ChatState } from '../../context/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react';

function UserListItem({ user, handleFunction }) {
    // const user = ChatState();
  return (
  <>
  <Box
  onClick={handleFunction}
  cursor={'pointer'}
  bg={'#bbbbbb'}
  _hover={ {
        background: "#0c9785",
        color: "white"
    } }
    width={'100%'}
    display={"flex"}
    alignItems={"center"}
    px={3}
    py={2}
    mb={2}
    borderRadius={'lg'}
  >
    <Avatar
    mr={2}
    size={"sm"}
    cursor={'pointer'}
    name={user.name}
    src={user.avatar}
    border={"1px"}
    />
    <Box>
        <Text fontSize={"13px"} fontWeight={"600"}>
            {user.email}
        </Text>
    </Box>

  </Box>
  </>
  )
}

export default UserListItem