import * as Types from '../types';

// Re-export types for easier importing
export type { Contact as Sender, Message, SenderWithLatestMessage } from '../types';

// Storage keys for localStorage
const STORAGE_KEYS = {
  CONTACTS: 'sms_simulator_contacts',
  MESSAGES: 'sms_simulator_messages',
  CONVERSATIONS: 'sms_simulator_conversations',
  INITIALIZED: 'sms_simulator_initialized'
};

// Load data from localStorage or initialize with dummy data if not found
const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

// Initialize with dummy data if this is the first time
const initializeWithDummyData = (): void => {
  // Self contact
  const selfContact: Types.Contact = { id: 'self', name: 'Me', avatar: 'https://i.pravatar.cc/150?img=self' };

  // Other contacts
  const dummyContactNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'];
  const dummyContacts: Types.Contact[] = dummyContactNames.map((name, index) => ({
    id: String(index + 1),
    name: name,
    avatar: `https://i.pravatar.cc/150?img=${index + 1}`
  }));

  // Generate conversations and messages
  let messageIdCounter = 1;
  let conversationIdCounter = 1;
  const messages: Types.Message[] = [];
  const conversations: Types.Conversation[] = [];

  dummyContacts.forEach(contact => {
    const conversationId = `c${conversationIdCounter++}`;
    const participantIds = [contact.id, 'self'];
    let lastMessage: Types.Message | null = null;

    // Generate 5 messages for each conversation
    for (let i = 0; i < 5; i++) {
      const sender = (i % 2 === 0) ? contact : selfContact;
      const receiver = (i % 2 === 0) ? selfContact : contact;
      const text = (i % 2 === 0)
        ? `Hey ${receiver.name}, this is ${sender.name}. Message ${i + 1}.`
        : `Hi ${sender.name}, ${receiver.name} here. Reply to message ${i + 1}.`;
      const timestamp = new Date(Date.now() - (dummyContacts.length - parseInt(contact.id)) * 3600000 - (5 - i) * 60000).toISOString();

      const newMessage: Types.Message = {
        id: `m${messageIdCounter++}`,
        conversationId,
        senderId: sender.id,
        text,
        timestamp,
      };
      messages.push(newMessage);
      lastMessage = newMessage;
    }

    if (lastMessage) {
      conversations.push({ id: conversationId, participantIds, lastMessage });
    } else {
      conversations.push({ id: conversationId, participantIds, lastMessage: null });
    }
  });

  // Save dummy data to storage
  const allContacts = [selfContact, ...dummyContacts];
  saveToStorage(STORAGE_KEYS.CONTACTS, allContacts);
  saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
};

// Load or initialize data
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    initializeWithDummyData();
  }
}

// Load data from storage
let contacts: Types.Contact[] = loadFromStorage(STORAGE_KEYS.CONTACTS, []);
let messages: Types.Message[] = loadFromStorage(STORAGE_KEYS.MESSAGES, []);
let conversations: Types.Conversation[] = loadFromStorage(STORAGE_KEYS.CONVERSATIONS, []);

// Helper function to save all data
const saveAllData = (): void => {
  saveToStorage(STORAGE_KEYS.CONTACTS, contacts);
  saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
};

export const getContacts = (): Types.Contact[] => contacts;
export const getMessages = (conversationId: string): Types.Message[] => messages.filter(m => m.conversationId === conversationId);
export const getConversations = (): Types.Conversation[] => conversations;

export const sendMessage = (conversationId: string, senderId: string, text: string): Types.Message => {
  const newMessage: Types.Message = {
    id: `m${messages.length + 1}`,
    conversationId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);

  // Update last message in conversation
  const conversation = conversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.lastMessage = newMessage;
  }

  saveAllData();
  return newMessage;
};

export const createConversation = (participantIds: string[]): Types.Conversation => {
  const newConversation: Types.Conversation = {
    id: `c${conversations.length + 1}`,
    participantIds,
    lastMessage: null,
  };
  conversations.push(newConversation);
  saveAllData();
  return newConversation;
};

export const getSendersWithLatestMessage = (): Types.SenderWithLatestMessage[] => {
  const sendersWithLatestMessage: Types.SenderWithLatestMessage[] = [];

  conversations.forEach(conv => {
    if (conv.lastMessage) {
      const otherParticipantId = conv.participantIds.find(id => id !== 'self');
      const senderContact = contacts.find(c => c.id === otherParticipantId);

      if (senderContact) {
        sendersWithLatestMessage.push({
          ...senderContact,
          lastMessageTimestamp: new Date(conv.lastMessage.timestamp).getTime(),
        });
      }
    }
  });

  return sendersWithLatestMessage;
};

export const getMessagesBySender = (senderId: string): Types.Message[] => {
  const conversation = conversations.find(conv => conv.participantIds.includes(senderId) && conv.participantIds.includes('self'));
  if (conversation) {
    return messages.filter(msg => msg.conversationId === conversation.id);
  }
  return [];
};

export const getUnreadMessageCount = (_senderId: string): number => {
  return 0;
};

// Functions for SettingsPage
export const getSenders = (): Types.Sender[] => {
  return contacts.filter(contact => contact.id !== 'self');
};

export const addSender = (name: string): Types.Sender => {
  const newSender: Types.Sender = {
    id: String(contacts.length),
    name: name,
    avatar: `https://i.pravatar.cc/150?img=${contacts.length}`
  };
  contacts.push(newSender);
  saveAllData();
  return newSender;
};

export const deleteSender = (senderId: string): void => {
  // Remove sender from contacts
  contacts = contacts.filter(contact => contact.id !== senderId);

  // Remove all conversations involving this sender
  conversations = conversations.filter(conv =>
    !conv.participantIds.includes(senderId)
  );

  // Remove all messages from conversations involving this sender
  messages = messages.filter(msg => {
    const conversation = conversations.find(conv => conv.id === msg.conversationId);
    return conversation !== undefined;
  });

  saveAllData();
};

export const addMessage = (senderId: string, text: string): Types.Message => {
  // Find or create conversation with this sender
  let conversation = conversations.find(conv =>
    conv.participantIds.includes(senderId) && conv.participantIds.includes('self')
  );

  if (!conversation) {
    // Create new conversation if it doesn't exist
    conversation = createConversation([senderId, 'self']);
  }

  // Add the message and return it
  return sendMessage(conversation.id, senderId, text);
};

export const getSenderById = (senderId: string): Types.Sender | undefined => {
  return contacts.find(contact => contact.id === senderId);
};

export const markMessagesAsRead = (_senderId: string): void => {
  // In a real application, this would mark messages as read
  // For this dummy implementation, we don't need to do anything
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONTACTS);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  contacts = [];
  messages = [];
  conversations = [];
};
