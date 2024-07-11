import {
    Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const navigate = useNavigate();

  const handleShowPassword = () =>setShow(!show);
  const handleShowPassword2 = () =>setShow(!show);


  const postDetails = (avatars) => {
    setLoading(true);

    if (avatars === undefined) {
      toast({
        title: 'Please Select an Image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      })
    }

    if ( avatars && (avatars.type === "image/jpeg" || avatars.type === "image/png" || avatars.type === "image/jpg") ) {
      const data = new FormData();
      data.append("file", avatars);
      data.append("upload_preset", "chatsapp")
      data.append("cloud_name", "dhc6husi2")
      fetch("https://api.cloudinary.com/v1_1/dhc6husi2/image/upload", 
        {
          method:"post",
          body:data,
        }
      ).then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setAvatar(data.url.toString());
        setLoading(false)
      })
      .catch((error) => {
        // console.log(error)
        setLoading(false)
      });
    } else {
      toast({
        title: 'Can not fetch Image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      })
      setLoading(false);
      return;
    }

  }

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      })
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords not matching',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      })
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers : {
          "content-type" : "application/json"
        }
      }
      const {data} = await axios.post("/api/user", {name, email, password, avatar}, config);
      toast({
        title: 'Registration successfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      })
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chats')
      return;
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <VStack
        spacing={4}
        align="stretch"
      >
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            // border={"1px"}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter email id"
            onChange={(e) => setEmail(e.target.value)}
            // border={"1px"}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
            type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            //   border={"1px"}
            />
            <InputRightElement width={"4.5rem"}>
            <Button h={"1.7rem"} size={"sm"} onClick={handleShowPassword}>
                {show ? "Hide" : "Show"}
            </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
            type={show ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)
              }
            //   border={"1px"}
            />
           {/* { console.log(password)} */}
           {/* { console.log(confirmPassword)} */}
            <InputRightElement width={"4.5rem"}>
            <Button h={"1.7rem"} size={"sm"} onClick={handleShowPassword2}>
                {show ? "Hide" : "Show"}
            </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Upload Avatar</FormLabel>
          <Input
          type="file"
          accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button colorScheme="blue"
        w={"100%"}
        marginTop={15}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>

      </VStack>
    </>
  );
};

export default Signup;
