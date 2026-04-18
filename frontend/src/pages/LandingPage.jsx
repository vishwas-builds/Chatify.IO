import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  Input,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiUserCheck,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";

const Feature = ({ title, text, icon, badges = [] }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      p={6}
      spacing={4}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
      transition="all 0.3s ease"
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg={useColorModeValue("blue.500", "blue.400")}
      >
        {icon}
      </Flex>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text fontWeight={600} fontSize="lg">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="subtle"
              rounded="full"
              px={2}
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
      </Box>
    </Stack>
  );
};

const ChatMessage = ({ message, sender, time, isUser }) => {
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
      <Box
        bg={isUser ? "blue.500" : "gray.100"}
        color={isUser ? "white" : "gray.800"}
        borderRadius="lg"
        px={4}
        py={2}
        maxW="80%"
      >
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {sender}
        </Text>
        <Text>{message}</Text>
        <Text
          fontSize="xs"
          color={isUser ? "whiteAlpha.700" : "gray.500"}
          mt={1}
        >
          {time}
        </Text>
      </Box>
    </Flex>
  );
};

export default function LandingPage() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
      position="relative"
    >
      {/* --- NAVIGATION BAR --- */}
      <Flex
        as="nav"
        position="fixed"
        top={0}
        right={0}
        left={0}
        py={4}
        px={12}
        bg={useColorModeValue("white", "gray.800")}
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        boxShadow="sm"
        justify="space-between"
        align="center"
        zIndex={100}
        display={{ base: "none", md: "flex" }}
      >
        {/* Brand/Logo Section */}
        <HStack
          spacing={3}
          as={RouterLink}
          to="/"
          _hover={{ textDecoration: "none" }}
        >
          <Icon as={FiMessageSquare} w={8} h={8} color="blue.400" />
          <Heading
            size="md"
            fontWeight="bold"
            letterSpacing="tight"
            color={useColorModeValue("gray.800", "white")}
          >
            Chatify.IO
          </Heading>
        </HStack>

        {/* Navigation Items */}
        <HStack spacing={4}>
          {" "}
          <Button
            as="a"
            href="#features"
            variant="ghost"
            colorScheme="blue"
            fontSize="lg"
            fontWeight={600}
            px={4}
          >
            Features
          </Button>
          <Button
            as={RouterLink}
            to="/login"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FiLogIn />}
            fontSize="lg"
            fontWeight={600}
            px={4}
          >
            Sign In
          </Button>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="blue"
            bg="blue.400"
            rounded="full"
            _hover={{ bg: "blue.500" }}
            fontSize="lg"
            fontWeight={600}
            px={8}
            leftIcon={<FiUserPlus />}
          >
            Join Now
          </Button>
        </HStack>
      </Flex>
      {/* ------------------------------- */}

      {/* Hero Section */}
      <Container
        maxW="7xl"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        pt={20}
        pb={10}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 5, md: 10 }}
          align="center"
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text
                as="span"
                position="relative"
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Chatify.IO
              </Text>
              <br />
              <Text as="span" color="blue.400">
                Chat App
              </Text>
            </Heading>
            <Text color="gray.500" fontSize="xl">
              Experience the next generation of real-time communication.
              Chatify.IO provides a secure, fast, and seamless platform to
              connect with teams and communities worldwide.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/register"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                colorScheme="blue"
                bg="blue.400"
                _hover={{ bg: "blue.500" }}
                leftIcon={<FiUserPlus />}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiLogIn />}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>

          {/* Chat Preview */}
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height="420px"
              rounded="2xl"
              boxShadow="2xl"
              width="full"
              overflow="hidden"
              bg="white"
              border="1px"
              borderColor="gray.200"
            >
              {/* Chat Header */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bg="blue.500"
                p={4}
                color="white"
                borderBottom="1px"
                borderColor="blue.600"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text fontWeight="bold">Team Chatify.IO</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Badge colorScheme="green" variant="solid">
                      3 online
                    </Badge>
                    <Icon as={FiGlobe} />
                  </HStack>
                </HStack>
              </Box>

              {/* Chat Messages */}
              <VStack
                spacing={4}
                p={4}
                pt="75px"
                h="full"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-track": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#E2E8F0",
                    borderRadius: "24px",
                  },
                }}
              >
                <ChatMessage
                  sender="Sarah Chen"
                  message="Hey team! Just pushed the new updates to staging."
                  time="10:30 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Alex Thompson"
                  message="Great work! The new features look amazing 🚀"
                  time="10:31 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks! Let's review it in our next standup."
                  time="10:32 AM"
                  isUser={true}
                />
                <ChatMessage
                  sender="Sarah Chen"
                  message="Should I also update the documentation?"
                  time="10:34 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Alex Thompson"
                  message="Yes, that would be helpful for the handoff."
                  time="10:35 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="I'll handle the deployment part."
                  time="10:36 AM"
                  isUser={true}
                />
                <ChatMessage
                  sender="Sarah Chen"
                  message="Awesome, keeping the momentum going!"
                  time="10:38 AM"
                  isUser={false}
                />
                <Box w="100%" textAlign="right">
                  <Badge colorScheme="gray" fontSize="xs">
                    Sarah is typing...
                  </Badge>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Stack>
      </Container>
      {/* Features Grid */}
      <Box pt={0} pb={10} position="relative">
        <Box
          id="features"
          position="absolute"
          top="-70px"
          visibility="hidden"
        />

        <VStack spacing={2} textAlign="center" mb={5}>
          <Heading fontSize="4xl">Powerful Features</Heading>
          <Text fontSize="lg" color="gray.500">
            Everything you need for seamless team collaboration
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          px={{ base: 4, md: 8 }}
        >
          <Feature
            icon={<Icon as={FiLock} w={10} h={10} />}
            title="Secure Authentication"
            badges={[{ text: "Secure", color: "green" }]}
            text="Register and login securely with email verification and encrypted passwords."
          />
          <Feature
            icon={<Icon as={FiUsers} w={10} h={10} />}
            title="Group Management"
            badges={[{ text: "Real-time", color: "blue" }]}
            text="Create, join, or leave groups easily. Manage multiple conversations in one place."
          />
          <Feature
            icon={<Icon as={FiUserCheck} w={10} h={10} />}
            title="Online Presence"
            badges={[{ text: "Live", color: "green" }]}
            text="See who's currently online and active in your groups in real-time."
          />
          <Feature
            icon={<Icon as={FiActivity} w={10} h={10} />}
            title="Typing Indicators"
            badges={[{ text: "Interactive", color: "purple" }]}
            text="Know when others are typing with real-time typing indicators."
          />
          <Feature
            icon={<Icon as={FiMessageSquare} w={10} h={10} />}
            title="Instant Messaging"
            badges={[{ text: "Fast", color: "orange" }]}
            text="Send and receive messages instantly with real-time delivery and notifications."
          />
          <Feature
            icon={<Icon as={FiGlobe} w={10} h={10} />}
            title="Global Access"
            badges={[{ text: "24/7", color: "blue" }]}
            text="Access your chats from anywhere, anytime with persistent connections."
          />
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <Box py={10}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={10}
          align="center"
          justify="center"
          bg={useColorModeValue("blue.100", "blue.900")}
          p={10}
          rounded="2xl"
          maxW="5xl"
          mx="auto"
          px={{ base: 6, md: 10 }}
        >
          <VStack align="flex-start" spacing={4}>
            <Heading size="lg">Ready to get started?</Heading>
            <Text color="gray.600" fontSize="lg">
              Join thousands of users already using our platform
            </Text>
          </VStack>
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            colorScheme="blue"
            rightIcon={<FiUserPlus />}
          >
            Create Free Account
          </Button>
        </Stack>
      </Box>
      {/* --- FOOTER--- */}
      <Box
        as="footer"
        bg="gray.900"
        color="gray.400"
        py={6}
        borderTop="1px solid"
        borderColor="gray.800"
      >
        <Container maxW="7xl">
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            spacing={4}
          >
            {/* Logo and Copyright */}
            <HStack spacing={4}>
              <HStack spacing={2}>
                <Icon as={FiMessageSquare} w={5} h={5} color="blue.400" />
                <Text fontWeight="bold" color="white">
                  Chatify.IO
                </Text>
              </HStack>
              <Text fontSize="sm">© 2026 Chatify. All rights reserved.</Text>
            </HStack>

            <HStack spacing={6}>
              <Box
                as="a"
                href="https://github.com/rachepallvishwas-dot"
                target="_blank"
                _hover={{ color: "white" }}
                transition="all 0.2s"
              >
                <Icon as={FiGithub} w={5} h={5} />
              </Box>
              <Box
                as="a"
                href="https://www.linkedin.com/in/rachepallvishwas-dot/"
                target="_blank"
                _hover={{ color: "white" }}
                transition="all 0.2s"
              >
                <Icon as={FiLinkedin} w={5} h={5} />
              </Box>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
