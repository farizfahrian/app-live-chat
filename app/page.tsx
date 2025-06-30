'use client';
import React, { useEffect, useRef, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [room, setRoom] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

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
    socket.on("username_taken", () => {
      setError("Username taken");
      setJoined(false)
    });

    socket.on("join_success", () => {
      setError("");
      setJoined(true);
    })
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoinRoom = () => {
    if (!room || !username) {
      setError("Please enter a room and username");
      return;
    }
    setError("");
    socket.emit("join_room", { room, username });
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
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-1">💡 How to test the chat:</p>
            <p>1. Open this page in two different browser tabs</p>
            <p>2. Enter different usernames and the same room name in both tabs</p>
            <p>3. Start chatting between the tabs!</p>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl">Room: {room}</h1>
          <ScrollArea className="h-96 rounded-md border whitespace-nowrap px-4 bg-gray-50">
            <div className="space-y-3">
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
          </ScrollArea>
          <div className="flex flex-col gap-2 mt-4">
            <ChatForm onSendMessage={handleSendMessage} />
          </div>
        </>
      )}
    </div>
  );
}
