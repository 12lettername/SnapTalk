import React, { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  Firestore,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Chat.css";
import TextField from "@mui/material/TextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button } from "@mui/material";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
export const Chat = (props) => {
  const dummy = useRef();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", props.room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: props.room,
      photo: auth.currentUser.photoURL,
      uid: auth.currentUser.uid,
    });

    setNewMessage("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDrop = (e) => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="chat-app">
        <main>
          <div className="header">
            <h1>Welcome to: {props.room}</h1>
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div
                className={`message ${
                  message.uid === auth.currentUser.uid ? "sent" : "received"
                }`}
                key={message.id}
              >
                <img
                  alt="avatar"
                  src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${message.user}`}
                />
                <p>
                  <span className="username">{message.user}</span>
                  <br></br>
                  {message.text}
                </p>
                <span ref={dummy}></span>
              </div>
            ))}
          </div>
          <div className="dropdown">
            <ArrowDropDownCircleIcon
              onClick={handleDrop}
              color="primary"
            ></ArrowDropDownCircleIcon>
          </div>
        </main>
        <form onSubmit={handleSubmit} className="new-message-form">
          <TextField
            color="primary"
            id="filled-basic"
            variant="filled"
            className="new-message-input"
            placeholder="Type your message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <Button
            disabled={!newMessage}
            variant="contained"
            className="send-button"
            type="submit"
            color="success"
          >
            <SendRoundedIcon>Send</SendRoundedIcon>
          </Button>
        </form>
      </div>
    </>
  );
};
