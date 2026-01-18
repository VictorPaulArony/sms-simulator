import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import ConversationPage from '../pages/ConversationPage';
import { getSenderById } from '../services/dataService';

const ConversationLayoutWrapper: React.FC = () => {
  const { id: senderId } = useParams<{ id: string }>();
  const [senderName, setSenderName] = useState('Conversation');

  useEffect(() => {
    if (senderId) {
      const sender = getSenderById(senderId);
      if (sender) {
        setSenderName(sender.name);
      } else {
        setSenderName('Unknown Sender');
      }
    }
  }, [senderId]);

  return (
    <Layout title={senderName} pageType="conversation" showSettingsLink>
      <ConversationPage />
    </Layout>
  );
};

export default ConversationLayoutWrapper;
