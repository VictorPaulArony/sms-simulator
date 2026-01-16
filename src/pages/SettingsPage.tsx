import React, { useState, useEffect } from 'react';
import { getSenders, addSender, deleteSender, addMessage, type Sender } from '../services/dataService';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [newSenderName, setNewSenderName] = useState('');
  const [selectedSender, setSelectedSender] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loadSenders = () => {
    const currentSenders = getSenders();
    setSenders(currentSenders);
    if (currentSenders.length > 0 && !currentSenders.some(s => s.id === selectedSender)) {
      setSelectedSender(currentSenders[0].id);
    } else if (currentSenders.length === 0) {
      setSelectedSender('');
    }
  };

  useEffect(() => {
    loadSenders();
  }, []);

  const handleAddSender = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSenderName.trim() === '') return;
    const newSender = addSender(newSenderName);
    setSenders([...senders, newSender]);
    setNewSenderName('');
    if (senders.length === 0) { // If it's the first sender, select it
      setSelectedSender(newSender.id);
    }
  };

  const handleDeleteSender = (senderId: string) => {
    if (window.confirm('Are you sure you want to delete this sender and all their messages?')) {
      deleteSender(senderId);
      loadSenders(); // Reload senders after deletion
    }
  };

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedSender) return;
    addMessage(selectedSender, newMessage);
    setNewMessage('');
    alert('Message added!');
  };

  return (
    <div className="settings-page">
      <div className="card">
        <h2>Add New Sender</h2>
        <form onSubmit={handleAddSender}>
          <input
            type="text"
            value={newSenderName}
            onChange={(e) => setNewSenderName(e.target.value)}
            placeholder="Enter sender's name"
          />
          <button type="submit">Add Sender</button>
        </form>
      </div>

      <div className="card">
        <h2>Existing Senders</h2>
        {senders.length === 0 ? (
          <p>No senders added yet.</p>
        ) : (
          <ul className="sender-list">
            {senders.map(sender => (
              <li key={sender.id} className="sender-item">
                <span>{sender.name}</span>
                <button
                  onClick={() => handleDeleteSender(sender.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Add Message</h2>
        <form onSubmit={handleAddMessage}>
          <select
            value={selectedSender}
            onChange={(e) => setSelectedSender(e.target.value)}
            disabled={senders.length === 0}
          >
            {senders.map(sender => (
              <option key={sender.id} value={sender.id}>
                {sender.name}
              </option>
            ))}
          </select>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter message text"
            rows={3}
            disabled={senders.length === 0}
          />
          <button type="submit" disabled={senders.length === 0}>Add Message</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
