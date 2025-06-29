'use client';
import React from 'react'

interface ChatMessageProps {
    isOwnMessage: boolean;
    sender?: string;
    message: string;
}

const ChatMessage = ({
    isOwnMessage,
    sender,
    message
}: ChatMessageProps) => {
    const isSystemMessage = sender === "System";
    return (
        <div className={`flex ${
            isSystemMessage 
                ? 'justify-center' 
                : isOwnMessage 
                    ? 'justify-end' 
                    : 'justify-start'
            } mb-3`}>
            <div className={`max-w-xs rounded-b-lg rounded-tl-lg rounded-tr-lg px-4 py-2 ${
                isSystemMessage 
                    ? 'bg-gray-800 text-white text-center text-xs font-semibold' 
                    : isOwnMessage 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-900'
            }`}>
                {(!isSystemMessage && !isOwnMessage) && <p className='text-sm font-semibold'>{sender}</p>}
                <p>{message}</p>
            </div>
        </div>
    )
}

export default ChatMessage