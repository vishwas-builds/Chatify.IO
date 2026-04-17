import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import UsersList from "./UsersList";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import apiURL from "../../utils";
import { FiSend, FiInfo, FiMessageCircle, FiTrash2 } from "react-icons/fi";

const ChatArea = ({ selectedGroup, socket, setSelectedGroup, fetchGroups }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const toast = useToast();
  const {
    isOpen: isInfoOpen,
    onOpen: onInfoOpen,
    onClose: onInfoClose,
  } = useDisclosure();

  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    if (selectedGroup && socket) {
      //fetch messages
      fetchMessages();
      socket.emit("join room", selectedGroup?._id);
      socket.on("message received", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("users in room", (users) => {
        setConnectedUsers(users);
      });

      socket.on("user joined", (user) => {
        setConnectedUsers((prev) => [...prev, user]);
      });

      socket.on("user left", (userId) => {
        setConnectedUsers((prev) =>
          prev.filter((user) => user?._id !== userId),
        );
      });

      socket.on("message deleted", (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      });

      socket.on("notification", (notification) => {
        toast({
          title:
            notification?.type === "USER_JOINED" ? "New User" : "Notification",
          description: notification.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

      socket.on("user typing", ({ username }) => {
        setTypingUsers((prev) => new Set(prev).add(username));
      });

      socket.on("user stop typing", ({ username }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      });

      //clean up
      return () => {
        socket.emit("leave room", selectedGroup?._id);
        socket.off("message received");
        socket.off("message deleted");
        socket.off("users in room");
        socket.off("user joined");
        socket.off("user left");
        socket.off("notification");
        socket.off("user typing");
        socket.off("user stop typing");
      };
    }
  }, [selectedGroup?._id, socket]);

  // New block for Auto-Scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUsers.size]);

  //fetch messages
  const fetchMessages = async () => {
    const token = currentUser?.token;
    try {
      const { data } = await axios.get(
        `${apiURL}/api/messages/${selectedGroup?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  //send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = currentUser.token;
      const { data } = await axios.post(
        `${apiURL}/api/messages`,
        {
          content: newMessage,
          groupId: selectedGroup?._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      socket.emit("new message", {
        ...data,
        groupId: selectedGroup?._id,
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    inputRef.current?.focus();
  };

  //handleTyping
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && selectedGroup) {
      setIsTyping(true);
      socket.emit("typing", {
        groupId: selectedGroup?._id,
        username: currentUser.username,
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup) {
        socket.emit("stop typing", {
          groupId: selectedGroup?._id,
        });
      }
      setIsTyping(false);
    }, 2000);
  };

  //format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // delete message
  const deleteMessage = async (messageId) => {
    try {
      const token = currentUser.token;
      await axios.delete(`${apiURL}/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      socket.emit("delete message", {
        messageId,
        groupId: selectedGroup._id,
      });

      toast({ title: "Message deleted", status: "success", duration: 2000 });
    } catch (error) {
      toast({
        title: "Error deleting message",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Delete Group
  const handleDeleteGroup = async (groupId) => {
    try {
      const token = currentUser.token;

      await axios.delete(`${apiURL}/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (fetchGroups) {
        await fetchGroups();
      }

      onInfoClose();
      setSelectedGroup(null);

      toast({
        title: "Group deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error deleting group",
        status: "error",
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  //render typing indicator
  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    const typingUsersArray = Array.from(typingUsers);

    return typingUsersArray?.map((username) => (
      <Box
        key={username}
        alignSelf={
          username === currentUser?.username ? "flex-start" : "flex-end"
        }
        maxW="70%"
      >
        <Flex
          align="center"
          bg={username === currentUser?.username ? "blue.50" : "gray.50"}
          p={2}
          borderRadius="lg"
          gap={2}
        >
          {username === currentUser?.username ? (
            <>
              <Avatar size="xs" name={username} />
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  You are typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w="3px"
                      h="3px"
                      borderRadius="full"
                      bg="gray.500"
                    />
                  ))}
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  {username} is typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w="3px"
                      h="3px"
                      borderRadius="full"
                      bg="gray.500"
                    />
                  ))}
                </Flex>
              </Flex>
              <Avatar size="xs" name={username} />
            </>
          )}
        </Flex>
      </Box>
    ));
  };

  return (
    <Flex
      h="100vh"
      overflow="hidden"
      position="relative"
      direction={{ base: "column", lg: "row" }}
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg="gray.50"
        maxW={{ base: "100%", lg: `calc(100% - 260px)` }}
      >
        {selectedGroup ? (
          <>
            <Flex
              px={6}
              py={0}
              h="72px"
              align="center"
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
            >
              <Button
                display={{ base: "inline-flex", md: "none" }}
                variant="ghost"
                mr={2}
                onClick={() => setSelectedGroup(null)}
              >
                ←
              </Button>
              <Icon
                as={FiMessageCircle}
                fontSize="24px"
                color="blue.500"
                mr={3}
              />
              <Box flex="1">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  noOfLines={1}
                >
                  {selectedGroup.name}
                </Text>
              </Box>
              <Icon
                as={FiInfo}
                fontSize="26px"
                color="gray.400"
                cursor="pointer"
                _hover={{ color: "blue.500" }}
                onClick={onInfoOpen}
              />
            </Flex>

            <VStack
              flex="1"
              overflowY="auto"
              spacing={4}
              align="stretch"
              px={6}
              py={4}
              position="relative"
            >
              {messages && messages.length === 0 ? (
                <Flex
                  h="100%"
                  direction="column"
                  align="center"
                  justify="center"
                  p={8}
                  textAlign="center"
                  flex="1"
                >
                  <Icon
                    as={FiMessageCircle}
                    fontSize="64px"
                    color="gray.300"
                    mb={4}
                  />
                  <Text
                    fontSize="xl"
                    fontWeight="medium"
                    color="gray.500"
                    mb={2}
                  >
                    Welcome to {selectedGroup?.name}!
                  </Text>
                  <Text color="gray.500">Start the conversation</Text>
                </Flex>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message._id}
                    alignSelf={
                      message.sender._id === currentUser?._id
                        ? "flex-end"
                        : "flex-start"
                    }
                    maxW="70%"
                  >
                    <Flex direction="column" gap={1}>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        alignSelf={
                          message.sender._id === currentUser?._id
                            ? "flex-end"
                            : "flex-start"
                        }
                      >
                        {message.sender._id === currentUser?._id
                          ? "You"
                          : message.sender.username}{" "}
                        • {formatTime(message.createdAt)}
                      </Text>
                      <Box
                        role="group"
                        bg={
                          message.sender._id === currentUser?._id
                            ? "blue.500"
                            : "white"
                        }
                        color={
                          message.sender._id === currentUser?._id
                            ? "white"
                            : "gray.800"
                        }
                        p={3}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={
                          message.sender._id === currentUser?._id ? "0" : "1px"
                        }
                        borderColor="gray.100"
                      >
                        <HStack
                          justify="space-between"
                          spacing={4}
                          align="flex-start"
                        >
                          <Text wordBreak="break-word">{message.content}</Text>
                          {message.sender._id === currentUser?._id && (
                            <Icon
                              as={FiTrash2}
                              cursor="pointer"
                              fontSize="lg"
                              opacity="0"
                              _groupHover={{ opacity: "0.6" }}
                              _hover={{ opacity: "1", color: "red.200" }}
                              onClick={() => deleteMessage(message._id)}
                              mt={1}
                            />
                          )}
                        </HStack>
                      </Box>
                    </Flex>
                  </Box>
                ))
              )}
              {renderTypingIndicator()}
              <div ref={messagesEndRef} />
            </VStack>

            <Box
              px={6}
              py={0}
              h="80px"
              display="flex"
              alignItems="center"
              bg="white"
              borderTop="1px solid"
              borderColor="gray.200"
              position="relative"
              zIndex="1"
            >
              <InputGroup size="lg">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  pr="4.5rem"
                  bg="gray.50"
                  border="none"
                  _focus={{ boxShadow: "none", bg: "gray.100" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                    borderRadius="full"
                    onClick={sendMessage}
                  >
                    <Icon as={FiSend} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </>
        ) : (
          <Flex
            h="100%"
            direction="column"
            align="center"
            justify="center"
            p={8}
            textAlign="center"
          >
            <Icon
              as={FiMessageCircle}
              fontSize="64px"
              color="gray.300"
              mb={4}
            />
            <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
              Welcome to the Chatify.IO!
            </Text>
            <Text color="gray.500" mb={2}>
              Select a group from the sidebar to start chatting
            </Text>
          </Flex>
        )}
      </Box>

      <Box
        width={{ base: "100%", lg: "260px" }}
        display={{ base: "none", lg: "block" }}
      >
        {selectedGroup && <UsersList users={connectedUsers} />}
      </Box>

      <Modal isOpen={isInfoOpen} onClose={onInfoClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" color="gray.800">
            {selectedGroup?.name} - Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Text
              fontWeight="bold"
              mb={2}
              color="gray.500"
              fontSize="xs"
              letterSpacing="wider"
            >
              DESCRIPTION
            </Text>
            <Text color="gray.700" fontSize="md" lineHeight="tall" mb={6}>
              {selectedGroup?.description ||
                "No description provided for this group."}
            </Text>

            {selectedGroup?.admin?._id === currentUser?._id && (
              <Button
                colorScheme="red"
                variant="outline"
                width="full"
                size="sm"
                mt={4}
                onClick={() => handleDeleteGroup(selectedGroup._id)}
              >
                Delete Group Permanently
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ChatArea;
