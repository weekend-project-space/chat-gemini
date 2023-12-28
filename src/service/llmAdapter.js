import {
  req
} from '@/api'

export async function llm(text, type = 'gemi') {
  if (type == 'gemi') {
    return (await req(typeof text === 'string' ? {
      "contents": [{
        "parts": [{
          "text": text
        }]
      }]
    } : text)).candidates[0].content.parts[0].text
  }

}
