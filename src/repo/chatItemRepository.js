import {
  chatItems,
} from './db'

export async function save(item) {
  item.time = new Date().getTime()
  if (item.id) {
    return await chatItems.update(item.id, item)
  } else {
    return await chatItems.add(item)
  }
}

export async function batchAdd(items) {
  const time = new Date().getTime()
  return await chatItems.bulkAdd(items.map(o => {
    o.time = time;
    return o
  }))
}

export async function listChatItem(chatId) {
  return await chatItems.where('chatId').equals(chatId).toArray()
}

export async function del(id) {
  return await chatItems.delete(id)
}


export async function delByChatId(chatId) {
  const items = await listChatItem(chatId)
  return await chatItems.bulkDelete(items.map(o => o.id))
}

export async function delLastId(chatId, lastId) {
  const items = await chatItems.where('chatId').equals(chatId).filter(o => o.id >= lastId).toArray()
  return await chatItems.bulkDelete(items.map(o => o.id))
}
