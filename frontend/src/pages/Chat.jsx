import { Box, Flex, useToast } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import io from "socket.io-client";
import { useEffect, useState, useCallback } from "react";
import apiURL from "../../utils";
import axios from "axios";

const ENDPOINT = apiURL;

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  const fetchGroups = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;
      if (!token) return [];

      const { data } = await axios.get(`${apiURL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(data);

      const userGroupIds = data
        ?.filter((group) =>
          group?.members?.some((m) => m?._id === userInfo?._id),
        )
        .map((group) => group?._id);
      setUserGroups(userGroupIds || []);

      return data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const newSocket = io(ENDPOINT, {
      auth: { user: userInfo },
    });
    setSocket(newSocket);

    fetchGroups(); // Initial load

    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup && savedGroup !== "null") {
      setSelectedGroup(JSON.parse(savedGroup));
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [fetchGroups]);

  useEffect(() => {
    localStorage.setItem("selectedGroup", JSON.stringify(selectedGroup));
  }, [selectedGroup]);

  return (
    <Flex h="100vh" direction={{ base: "column", md: "row" }}>
      <Box
        w={{ base: "100%", md: "300px" }}
        h={{ base: "auto", md: "100vh" }}
        borderRight="1px solid"
        borderColor="gray.200"
        display={{ base: selectedGroup ? "none" : "block", md: "block" }}
      >
        <Sidebar
          setSelectedGroup={setSelectedGroup}
          socket={socket}
          groups={groups}
          userGroups={userGroups}
          fetchGroups={fetchGroups}
        />
      </Box>
      <Box
        flex="1"
        display={{ base: selectedGroup ? "block" : "none", md: "block" }}
      >
        {socket && (
          <ChatArea
            key={selectedGroup?._id || "welcome"}
            selectedGroup={selectedGroup}
            socket={socket}
            setSelectedGroup={setSelectedGroup}
            fetchGroups={fetchGroups}
          />
        )}
      </Box>
    </Flex>
  );
};

export default Chat;
