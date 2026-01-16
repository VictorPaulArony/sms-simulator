export interface Sender {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

const SENDERS_KEY = 'sms_pwa_senders';
const MESSAGES_KEY = 'sms_pwa_messages';

// --- Senders ---

export const getSenders = (): Sender[] => {
  const senders = localStorage.getItem(SENDERS_KEY);
  return senders ? JSON.parse(senders) : [];
};

export const getSenderById = (id: string): Sender | undefined => {
  const senders = getSenders();
  return senders.find(sender => sender.id === id);
};

export const addSender = (name: string): Sender => {
  const senders = getSenders();
  const newSender: Sender = { id: Date.now().toString(), name };
  const updatedSenders = [...senders, newSender];
  localStorage.setItem(SENDERS_KEY, JSON.stringify(updatedSenders));
  return newSender;
};

export const deleteSender = (senderId: string): void => {
  // Remove sender
  const senders = getSenders();
  const updatedSenders = senders.filter(sender => sender.id !== senderId);
  localStorage.setItem(SENDERS_KEY, JSON.stringify(updatedSenders));

  // Remove associated messages
  const allMessages = localStorage.getItem(MESSAGES_KEY);
  const messages: Message[] = allMessages ? JSON.parse(allMessages) : [];
  const updatedMessages = messages.filter(message => message.senderId !== senderId);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
};

// --- Messages ---

export const getMessagesBySender = (senderId: string): Message[] => {
  const allMessages = localStorage.getItem(MESSAGES_KEY);
  const messages: Message[] = allMessages ? JSON.parse(allMessages) : [];
  return messages.filter(msg => msg.senderId === senderId).sort((a, b) => a.timestamp - b.timestamp);
};

export const addMessage = (senderId: string, text: string): Message => {
  const allMessages = localStorage.getItem(MESSAGES_KEY);
  const messages: Message[] = allMessages ? JSON.parse(allMessages) : [];
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId,
    text,
    timestamp: Date.now(),
  };
  const updatedMessages = [...messages, newMessage];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  return newMessage;
};
