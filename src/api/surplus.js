export async function getSurplus() {
  const API = 'https://zhidayingxiao.cn/v1/cardamom/surplus'
  return await (await fetch(API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('qaiKey') || ''
    },
  })).text()
}
