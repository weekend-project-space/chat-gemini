// db.js
import Dexie from 'dexie';

export const db = new Dexie('chatdb');
db.version(1).stores({
  prompts: '++id, &name, prompt', // Primary key and indexed props
  chatItems: '++id, chatId, role, content, time',
  chats: '++id, name, time, &promptId'
});

export const chats = db.chats;
export const chatItems = db.chatItems;
export const prompts = db.prompts;
