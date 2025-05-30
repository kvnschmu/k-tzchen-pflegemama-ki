
import React from 'react';
import { ChatMessage } from '../types';
import { CatIcon } from './icons/CatIcon'; // For AI avatar

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Format timestamp to a readable string, e.g., "14:35"
  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="flex-shrink-0 mr-2 self-start">
            <CatIcon className="h-8 w-8 text-rose-400 bg-rose-100 p-1 rounded-full shadow" />
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-xl shadow-md ${
            isUser
              ? 'bg-emerald-500 text-white rounded-br-none'
              : 'bg-white text-neutral-700 border border-rose-200 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-emerald-100 text-right' : 'text-neutral-400 text-left'}`}>
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
};
