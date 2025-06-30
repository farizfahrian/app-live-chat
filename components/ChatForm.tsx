'use client';
import React from 'react'

const ChatForm = ({
    onSendMessage
}: {
    onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!message) return;
    onSendMessage(message);
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-2'>
      <input 
        type="text" 
        placeholder='Type your message' 
        className='flex-1 rounded-md border border-gray-300 px-4 py-2' 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className='rounded bg-blue-500 px-4 py-2 text-white'>Send</button>
    </form>
  )
}

export default ChatForm