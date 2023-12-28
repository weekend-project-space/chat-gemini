export async function req(data) {
  const API_BASE = localStorage.getItem('geminiApi') || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key='
  const API = API_BASE + localStorage.getItem('geminiKey')
  return await (await fetch(API, {
    method: 'POST',
    body: JSON.stringify(data)
  })).json()
}
