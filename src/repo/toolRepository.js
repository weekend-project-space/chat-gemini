import {
  tools,
} from './db'

export async function save(item) {
  if (item.id) {
    return await tools.update(item.id, item)
  } else {
    return await tools.add(item)
  }
}

export async function listAll(name) {
  return await tools.filter(o => !name || o.meta.name.indexOf(name) > -1).toArray()
}

export async function del(id) {
  return await tools.delete(id)
}

export async function get(id) {
  return await tools.get(id)
}

export async function findByName(name) {
  return await tools.filter(o => !name || o.meta.name.indexOf(name) > -1).first()
}
