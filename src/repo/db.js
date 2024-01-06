// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  contacts: '++id, name, prompt', // Primary key and indexed props
  chatItems: '++id, contactId, role, content, time',
  chats: '&contactId, name, time'
});

export const chats = db.chats;
export const chatItems = db.chatItems;
export const contacts = db.contacts;
