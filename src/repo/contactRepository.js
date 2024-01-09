import {
  contacts,
} from './db'

export async function save(item) {
  if (item.id) {
    return await contacts.update(item.id, item)
  } else {
    return await contacts.add(item)
  }
}

export async function listAll(name) {
  return await contacts.filter(o => !name || o.name.indexOf(name) > -1).toArray()
}

export async function del(id) {
  return await contacts.delete(id)
}

export async function get(id) {
  return await contacts.get(id)
}
