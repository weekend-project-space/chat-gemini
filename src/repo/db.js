// db.js
import Dexie from 'dexie';

export const db = new Dexie('chatdb');
db.version(1).stores({
  prompts: '++id, &name, prompt', // Primary key and indexed props
  chatItems: '++id, chatId, role, content, time',
  chats: '++id, name, time, &promptId, type',
  tools: '&id, meta, functions'
});

export const chats = db.chats;
export const chatItems = db.chatItems;
export const prompts = db.prompts;
export const tools = db.tools;

// let tools = {
//   id: '',
//   meta: {
//     avatar: '',
//     name: '',
//   },
//   functions: [{
//     url: '',
//     type: 'local|remote',
//     name: 'find_weather',
//     description: '获取当前天气',
//     "parameters": {
//       "type": "OBJECT",
//       "properties": {
//         "location": {
//           "type": "STRING",
//           "description": "地区名称"
//         },
//         "description": {
//           "type": "STRING",
//           "description": "任何类型的描述，包括类别或流派、标题词、属性等。"
//         }
//       },
//       "required": ["description"]
//     }
//   }]
// }
