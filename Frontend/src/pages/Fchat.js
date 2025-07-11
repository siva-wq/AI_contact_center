import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './chat.css';
import LanguageSwitcher from "../components/LanguageSwitcher";
import { FaComments } from 'react-icons/fa';


import { io } from 'socket.io-client';
import { bed,fed } from "../URL";

const Fchat = () => {
  const userId = localStorage.getItem("userId");
  console.log(userId)
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const role = localStorage.getItem('role');
  const [isTakenOver, setIsTakenOver] = useState(false);
  const scrollbottom=useRef(null);

  const socket = io(bed, {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log(`you connected with id: ${socket.id}`)
  })
  useEffect(() => {
    socket.emit("join-room", userId, "user");

    socket.on("receive-msg", (msg) => {
      console.log(userId)
      console.log(msg)
      if (msg.sender !== userId) {

        setChat((prev) => [...prev, msg]);
      }
    });

    return () => {

      socket.off("receive-msg");
    };
  }, []);

  const fetchmsg = async () => {
    try {
      const response = await axios.get(`${fed}/getmsg/${userId}`);
      const messages = response.data.messages || [];


      console.log(response)
      console.log("Previous messages:");
      messages.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.sender.toUpperCase()}]: ${msg.message}`);
      });

      setChat(messages);
      setIsTakenOver(response.data.isTakenOver);
      scrollbottom.current?.scrollIntoView({ behavior: "smooth" });
      console.log("Take over", isTakenOver)
    } catch (error) {
      console.error("Failed to fetch previous messages:", error);
    }
  };

  useEffect(()=>{
    console.log("scroll to bottom")
    scrollbottom.current?.scrollIntoView({behaviour:'smooth'});
  },[chat])

  useEffect(() => {

    fetchmsg();

  }, [])

  const sendMsg = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setChat((prev) => [...prev, userMsg]);
    setInput("");

    try {
      console.log(1)
     const res = await axios.get(`${fed}/istakenover/${userId}`)
      setIsTakenOver(res.data.status)
      console.log("is taken over", isTakenOver)
      if (isTakenOver) {

        socket.emit("send-message", {
          from: userId,
          to: userId,
          message: input,
        });

        await axios.post(`${fed}/saveMsg`, {
          userId,
          sender: "user",
          message: input,
        });
        return;
      }

      const response = await axios.post(`${fed}/chat`, {
        userId,
        sender: "user",
        message: input,
        lang: localStorage.getItem("lang"),
      });

      const botMsg = {
        sender: "bot",
        message: response.data.status
          ? response.data.botmsg
          : "Issue in sending the message to the bot",
      };

      setChat((prev) => [...prev, botMsg]);
      scrollbottom.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
  <div className="chat-box">
    <div className="chat-header">
      <FaComments className="chat-icon" />
      <h2>Chat with AI Assistant</h2>
      <div className="lang">
        <LanguageSwitcher />
      </div>
    </div>

    <div className="chat-messages">
      {chat.map((msg, idx) => (
        <div key={idx} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
          {msg.message}
        </div>
      ))}
      <div ref={scrollbottom}/>
    </div>

    <div className="input-area">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        placeholder="Type a message..."
      />
      <button onClick={sendMsg}>Send</button>
      
    </div>
    
  </div>
  
</div>

  );
};

export default Fchat;
