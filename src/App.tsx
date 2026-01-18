import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InboxPage from './pages/InboxPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ConversationLayoutWrapper from './components/ConversationLayoutWrapper'; // Import the new wrapper

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout title="Messaging" pageType="inbox" showSettingsLink><InboxPage /></Layout>} />
        {/* Use the wrapper for the conversation route to dynamically set the title */}
        <Route path="/conversation/:id" element={<ConversationLayoutWrapper />} />
        <Route path="/settings" element={<Layout title="Settings" pageType="settings"><SettingsPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
