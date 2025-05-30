
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';
import { SendIcon } from './icons/SendIcon';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { Chat } from '@google/genai'; // Ensure correct import path if types are separate

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await createChatSession();
      setChatSession(session);
      // Add a welcoming message from the AI
      setMessages([{
        id: 'initial-ai-message',
        text: "Hallo mein Schatz! Ich bin da, um dir bei allen Fragen rund um dein Katzenbaby zu helfen. Erzähl mir, was dich beschäftigt.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error("Failed to initialize chat session:", err);
      setError("Entschuldigung, ich habe gerade technische Probleme und kann den Chat nicht starten. Bitte versuche es später erneut.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseText = await sendMessageToChat(chatSession, userMessage.text);
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err) {
      console.error("Failed to send message or get AI response:", err);
      const errorMessage = err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten.";
      setError(`Es tut mir leid, aber ich konnte deine Anfrage nicht bearbeiten. ${errorMessage}`);
       const aiErrorResponseMessage: ChatMessage = {
        id: Date.now().toString() + '-ai-error',
        text: "Oh je, da ist wohl etwas schiefgelaufen bei mir. Könntest du das bitte wiederholen oder etwas anders formulieren? Manchmal verstehe ich nicht alles auf Anhieb.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, aiErrorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-lg overflow-hidden border border-rose-200">
      <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar bg-rose-50">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 p-3 rounded-lg shadow">
              <LoadingIndicator />
              <span>Die Pflegemama denkt nach...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm border-t border-red-200">
          <strong>Fehler:</strong> {error}
        </div>
      )}
      {!chatSession && !isLoading && !error && (
         <div className="p-4 text-center text-neutral-500">
           <LoadingIndicator />
           <p>Verbindung zur Kätzchen-Pflegemama wird hergestellt...</p>
         </div>
      )}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-rose-200 bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={chatSession ? "Stelle deine Frage zur Kätzchenpflege..." : "Bitte warte, Chat wird geladen..."}
            className="flex-grow p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-colors duration-200"
            disabled={isLoading || !chatSession}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !chatSession}
            className="p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            aria-label="Nachricht senden"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
