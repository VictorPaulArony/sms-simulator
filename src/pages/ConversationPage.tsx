import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesBySender, addMessage, markMessagesAsRead, type Message } from '../services/dataService';
import './ConversationPage.css';

const ConversationPage: React.FC = () => {
  const { id: senderId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (senderId) {
      markMessagesAsRead(senderId);
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

  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.timestamp).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {} as { [key: string]: Message[] });
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="conversation-page">
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages in this conversation yet.</p>
        ) : (
          Object.entries(groupedMessages).map(([date, messagesOnDate]) => (
            <React.Fragment key={date}>
              <div className="date-separator">{date}</div>
              {messagesOnDate.map((message) => (
                <div key={message.id} className="message-bubble received">
                  <p>{message.text}</p>
                  <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <button type="button" className="attachment-button">
          <span className="material-symbols-outlined">
            attachment
          </span>
        </button>
        <input
          type="text"
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Enter message"
        />
        <button type="submit" className="send-button">
          <span className="material-symbols-outlined">
            send
          </span>
        </button>
      </form>
    </div>
  );
};

export default ConversationPage;
