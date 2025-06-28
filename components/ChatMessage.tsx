'use client';
import React from 'react'

const ChatMessage = ({
    isOwnMessage,
    sender,
    message
}: {
    isOwnMessage: boolean;
    sender?: string;
    message: string;
}) => {
    const isSystemMessage = !isOwnMessage && !sender;
    return (
        <div className={`flex ${
            isSystemMessage ? 'justify-center' : isOwnMessage ? 'justify-end' : 'justify-start'
            } items-center`}>
            <div className={`max-w-[80%] rounded-b-lg rounded-tl-lg rounded-tr-lg p-2 ${
                isSystemMessage ? 'bg-gray-200' : isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
            }`}>
                {!isSystemMessage && <p className='text-sm text-gray-500'>{sender}</p>}
                <p>{message}</p>
            </div>
        </div>
    )
}

export default ChatMessage