import {
  chats,
} from './db'

export async function save(item) {
  item.time = new Date().getTime()
  if (item.id) {
    return await chats.update(item.id, item)
  } else {
    return await chats.add(item)
  }
}

export async function listAll(name) {
  const d = await chats.filter(o => !name || o.name.indexOf(name) > -1).toArray()
  d.sort((x, y) => y.time - x.time)
  return d
}

export async function del(id) {
  return await chats.delete(id)
}

export async function get(id) {
  return await chats.get(id)
}


export async function getByPromptId(promptId) {
  return await chats.where('promptId').equals(promptId).first()
}
