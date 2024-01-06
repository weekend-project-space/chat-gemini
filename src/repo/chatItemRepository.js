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

export async function listChatItem(contactId) {
  return await chatItems.where('contactId').equals(contactId).toArray()
}

export async function del(contactId) {
  const items = await listChatItem(contactId)
  return await chatItems.bulkDelete(items.map(o => o.id))
}
