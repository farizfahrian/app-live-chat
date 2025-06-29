'use client';
import React, { useEffect, useRef, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [username, setUsername] = useState<string>('');

  // 1. Create a dummy div ref for scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "System", message }]);
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, [joined]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoinRoom = () => {
    if (!room || !username) return;
    socket.emit("join_room", { room, username });
    setJoined(true);
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: username };
    socket.emit("message", data);
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      {!joined ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Join Room</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Username"
              className="flex-1 rounded border border-gray-300 px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room"
              className="flex-1 rounded border border-gray-300 px-4 py-2"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">Room: {room}</h1>
            <ChatForm onSendMessage={handleSendMessage} />
          </div>

          <div className="h-[500px] overflow-y-auto space-y-3 p-4 m-4 bg-gray-50">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === username}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </>
      )}
    </div>
  );
}
