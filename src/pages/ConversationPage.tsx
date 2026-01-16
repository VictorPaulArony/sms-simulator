import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesBySender, addMessage, type Message } from '../services/dataService'; // Removed getSenderById
import './ConversationPage.css';

const ConversationPage: React.FC = () => {
  const { id: senderId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (senderId) {
      // The LayoutWrapper now handles setting the document.title based on sender name
      setMessages(getMessagesBySender(senderId));
    }
  }, [senderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessageText.trim() === '' || !senderId) return;

    const newMessage = addMessage(senderId, newMessageText);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setNewMessageText('');
  };

  return (
    <div className="conversation-page">
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages in this conversation yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-bubble">
              <p>{message.text}</p>
              <span className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ConversationPage;
