import {
  BASE_URL
} from './const'
export async function getSurplus() {
  const API = BASE_URL + '/v1/cardamom/surplus'
  return await (await fetch(API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('qaiKey') || ''
    },
  })).text()
}

export async function getKey() {
  const API = BASE_URL + '/v1/key'
  return await (await fetch(API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })).text()
}
