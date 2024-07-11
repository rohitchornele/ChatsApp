import React, { useState } from "react";
import axios from 'axios';
import {
    Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate();
  
    const handleClick = () =>setShow(!show);
  
  
    const submitHandler = async () => {
      setLoading(true);
      if (!email || !password ) {
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
  
      try {
        const config = {
          headers : {
            "content-type" : "application/json"
          }
        }
        const {data} = await axios.post("/api/user/login", { email, password }, config);
        // console.log(data);

        if (data) {
          toast({
            title: 'Login successfull',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position:"bottom",
          })
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          navigate('/chats')
          return;
        } else {
          toast({
            title: 'Invalid Credentials',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom",
          })
        }

        
      } catch (error) {
        // console.log(error)
      }
  
    }

    return (
        <>
          <VStack
            spacing={4}
            align="stretch"
          >
            
            <FormControl id="login-email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // border={"1px"}
              />
            </FormControl>
    
            <FormControl id="login-password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                //   border={"1px"}
                />
                <InputRightElement width={"4.5rem"}>
                <Button h={"1.7rem"} size={"sm"} onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
    
            <Button colorScheme="blue"
            w={"100%"}
            marginTop={15}
            onClick={submitHandler}
            >
                Log In
            </Button>

            <Button colorScheme="red"
            w={"100%"}
            marginTop={15}
            onClick={ () => {
              setEmail("guest@chatsapp.com");
              setPassword("123456")
            }}
            >
                Get Guest Users Credentials
            </Button>
    
          </VStack>
        </>
      );
}

export default Login