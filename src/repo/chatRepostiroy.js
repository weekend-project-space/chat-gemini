import {
  chat,
} from './db'

export async function save(item) {
  item.time = new Date().getTime()
  if (item.id) {
    return await chat.update(item.id, item)
  } else {
    return await chat.add(item)
  }
}

export async function listAll() {
  return await chat.toArray()
}

export async function del(id) {
  return await chat.delete(id)
}
