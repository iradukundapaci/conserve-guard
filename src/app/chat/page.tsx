"use client";

import * as React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { io, type Socket } from "socket.io-client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface Message {
  id?: string;
  createdAt: string;
  message: string;
  sender: { id: string };
  receiver: { id: string };
}

interface Contact {
  id: string;
  names: string;
}

interface ChatState {
  contacts: Contact[];
  selectedContact: Contact | null;
  messages: Message[];
  newMessage: string;
  loading: boolean;
  error: string | null;
}

const getCurrentUserId = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT and parse payload
    return payload.id; // Adjust according to your JWT payload structure
  }
  return null;
};

export default function Page(): React.JSX.Element {
  const [state, setState] = React.useState<ChatState>({
    contacts: [],
    selectedContact: null,
    messages: [],
    newMessage: "",
    loading: false,
    error: null,
  });
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const CURRENT_USER_ID = getCurrentUserId();

  React.useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      query: { userId: CURRENT_USER_ID },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("error", (error: Error) => {
      console.error("Socket error:", error);
      setState((prev) => ({ ...prev, error: "Connection error occurred" }));
    });

    newSocket.on("receiveMessage", (message: Message) => {
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            ...message,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [CURRENT_USER_ID]);

  // Fetch contacts
  React.useEffect(() => {
    const fetchContacts = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users");
        if (response.data?.payload?.items) {
          setState((prev) => ({
            ...prev,
            contacts: response.data.payload.items.map((user: any) => ({
              id: user.id,
              names: `${user.names}`,
            })),
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load contacts",
        }));
      }
    };

    fetchContacts();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleContactClick = async (contact: Contact) => {
    setState((prev) => ({
      ...prev,
      selectedContact: contact,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/chat/messages?senderId=${CURRENT_USER_ID}&receiverId=${contact.id}`,
      );

      setState((prev) => ({
        ...prev,
        messages: response.data,
        loading: false,
      }));
    } catch (error) {
      console.error("Error loading chat:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load chat history",
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!state.newMessage.trim() || !state.selectedContact || !socket) return;

    // Prepare the message data
    const messageData: Message = {
      sender: { id: CURRENT_USER_ID },
      receiver: { id: state.selectedContact.id },
      message: state.newMessage,
      createdAt: new Date().toISOString(), // Include createdAt for local state
    };

    try {
      // Emit the message to the server
      socket.emit("sendMessage", messageData);

      // Update local messages state
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, messageData],
        newMessage: "",
      }));
    } catch {
      console.error("Error sending message:");
      setState((prev) => ({
        ...prev,
        error: "Failed to send message",
      }));
    }
  };

  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, newMessage: event.target.value }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DefaultLayout>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f0f2f5" }}>
        <Box
          sx={{ width: 300, borderRight: "1px solid #ccc", bgcolor: "#ffffff" }}
        >
          <AppBar position="static" color="default" sx={{ bgcolor: "#075e54" }}>
            <Toolbar>
              <ChatIcon sx={{ color: "#ffffff" }} />
              <Typography variant="h6" sx={{ marginLeft: 1, color: "#ffffff" }}>
                Chat
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            {state.contacts.map((contact) => (
              <ListItem
                button
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                selected={state.selectedContact?.id === contact.id}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#e8e8e8",
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  },
                }}
              >
                <Avatar sx={{ marginRight: 1 }} />
                <ListItemText primary={contact.names} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: state.selectedContact ? "#efeae2" : "#f0f2f5",
          }}
        >
          {state.selectedContact ? (
            <>
              <AppBar
                position="static"
                color="default"
                sx={{ bgcolor: "#075e54" }}
              >
                <Toolbar>
                  <Avatar sx={{ marginRight: 1 }} />
                  <Typography variant="h6" sx={{ color: "#ffffff" }}>
                    {state.selectedContact.names}
                  </Typography>
                </Toolbar>
              </AppBar>

              <Box
                sx={{
                  flex: 1,
                  padding: 2,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {state.messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf:
                        msg.sender.id === CURRENT_USER_ID
                          ? "flex-end"
                          : "flex-start",
                      bgcolor:
                        msg.sender.id === CURRENT_USER_ID
                          ? "#dcf8c6"
                          : "#ffffff",
                      color: "black",
                      padding: 1,
                      borderRadius: 2,
                      maxWidth: "75%",
                      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <Typography variant="body1">{msg.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      {/* Format time */}
                    </Typography>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  padding: 2,
                  bgcolor: "#ffffff",
                  borderTop: "1px solid #ccc",
                }}
              >
                {state.error ? (
                  <Typography color="error" variant="caption" sx={{ mb: 1 }}>
                    {state.error}
                  </Typography>
                ) : null}
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Type a message"
                  value={state.newMessage}
                  onChange={handleMessageInput}
                  onKeyDown={handleKeyPress}
                  disabled={state.loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          onClick={handleSendMessage}
                          disabled={!state.newMessage.trim() || state.loading}
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "gray",
              }}
            >
              <Typography variant="h6">
                Select a contact to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </DefaultLayout>
  );
}
