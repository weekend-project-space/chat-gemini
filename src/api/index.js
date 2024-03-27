import {
  BASE_URL
} from './const'

export async function req(api, data, signal, config) {
  return await (await fetch(api, {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
    ...config
  })).json()
}


export async function* reqGemini(data, signal) {
  // const API_BASE = localStorage.getItem('qaiApi') || 'https://api-gm.xfjy.in/v1beta/models/gemini-pro:streamGenerateContent?key='
  const API = BASE_URL + '/v1/completions'

  const rb = await fetch(API, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('qaiKey') || ''
    },
    signal
  }).then(res => res.status < 300 ? res : Promise.reject(res.text())).then((response) => response.body).catch(async e => {
    throw new Error(await e)
  });
  const reader = rb.getReader();
  const textDecoder = new TextDecoder();
  let hasNext = true
  while (hasNext) {
    const {
      done,
      value
    } = await reader.read()
    if (done) {
      hasNext = !done
    } else {
      yield textDecoder.decode(value)
    }
  }
}
