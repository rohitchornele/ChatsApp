import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";


const ProfileModal = ({ user  , children }) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    <div className="">
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />
      )}
        <Modal isOpen={isOpen} onClose={onClose}
        size={"lg"}
        isCentered
        >
        <ModalOverlay  />
        <ModalContent
        
        height={"420px"}>
         { <ModalHeader 
         fontSize={"35px"}
         display={"flex"}
         justifyContent={"center"}
         >{user.name}</ModalHeader>}
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          justifyContent={"space-around"}
          alignItems={"center"}
          flexDir={"column"}
          >
            <Image 
            src={user.avatar} 
            alt={user.name}
            borderRadius={'full'}
            border={"2px"}
            boxSize={"150px"}
            objectFit={"cover"}
            ></Image>
            <Text
            fontSize={{base: "20px", md:"25px"}}
            >Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    </>
  );
};

export default ProfileModal;
