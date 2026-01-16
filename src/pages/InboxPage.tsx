import React, { useState, useEffect } from 'react';
import { getSenders, getMessagesBySender, type Sender } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import './InboxPage.css';

const InboxPage: React.FC = () => {
  const [senders, setSenders] = useState<Sender[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSenders(getSenders());
  }, []);

  const getLastMessageDetails = (senderId: string): { text: string; time: string } => {
    const messages = getMessagesBySender(senderId);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const textPreview = lastMessage.text.length > 30
        ? lastMessage.text.substring(0, 27) + '...'
        : lastMessage.text;
      const time = new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { text: textPreview, time };
    }
    return { text: 'No messages yet', time: '' };
  };

  return (
    <div className="inbox-page">
      {senders.length === 0 ? (
        <p className="no-conversations">No conversations yet. Go to settings to add senders and messages.</p>
      ) : (
        <div className="conversation-list">
          {senders.map(sender => {
            const lastMessage = getLastMessageDetails(sender.id);
            return (
              <div key={sender.id} className="conversation-item" onClick={() => navigate(`/conversation/${sender.id}`)}>
                <div className="sender-info">
                  <div className="sender-name">{sender.name}</div>
                  <div className="last-message-preview">{lastMessage.text}</div>
                </div>
                <div className="message-time">{lastMessage.time}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
