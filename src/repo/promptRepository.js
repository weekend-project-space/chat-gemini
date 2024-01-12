import {
  prompts,
} from './db'

export async function save(item) {
  if (item.id) {
    return await prompts.update(item.id, item)
  } else {
    return await prompts.add(item)
  }
}

export async function listAll(name) {
  return await prompts.filter(o => !name || o.name.indexOf(name) > -1).toArray()
}

export async function del(id) {
  return await prompts.delete(id)
}

export async function get(id) {
  // console.log('contact', id)
  return await prompts.get(id)
}
