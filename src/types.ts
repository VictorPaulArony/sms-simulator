export interface Contact {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string
}

export interface Conversation {
  id: string;
  participantIds: string[]; // IDs of participants
  lastMessage: Message | null;
}

// New types for InboxPage
export type Sender = Contact;

export interface SenderWithLatestMessage extends Contact {
  lastMessageTimestamp: number; // Using number for easier sorting
}
