import React, { useDeferredValue, useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from './miscellaneous/profileModal';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from "../api/axiosConfig";
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);



  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      )

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }

        setNewMessage("");
        const { data } = await axios.post(
          "api/message",
          {
            content: newMessage,
            chatId: selectedChat._id
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, [])


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {

      setMessages([...messages, newMessageReceived]);
   
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat_id) {

      } else {
        console.log("destructuring the message array")
      }
    })
  })

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    selectedChat ? (
      <>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
          bg="red"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            </>
          )}
        </Text>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          // bg="blue"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? (
            <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
            />
          ) : (
            <div className='messages'>
              <ScrollableChat messages={messages} />
            </div>
          )}
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            <Input
              variant="filled"
              bg="#5290c7"
              _hover={{
                borderColor: "blue.400", // Change border color to blue when hovered
                backgroundColor: "blue.100" // Change background color to light blue when hovered
              }}
              placeholder="Enter a message..."
              onChange={typingHandler}
              value={newMessage}
            />
          </FormControl>
        </Box>
      </>
    ) : (
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans" >
          Click on a user to start chatting
        </Text>
      </Box>
    )
  )
}

export default SingleChat
