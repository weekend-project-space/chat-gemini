import {
  req
} from '@/api'

const controller = new AbortController();

export const abort = controller.abort

export async function* llm(text, signal = controller.signal, type = 'gemi') {
  if (type == 'gemi') {
    for await (const line of (await req(typeof text === 'string' ? {
      "contents": [{
        "parts": [{
          "text": text
        }]
      }]
    } : text, signal))) {
      if (line.includes('{') || line.includes('}')) {
        const start = line.indexOf('{')
        const end = line.lastIndexOf('}')
        let str = ''
        for (let i = start; i <= end; i++) {
          str += line.charAt(i)
        }
        // console.log(str)
        // 存在bug 已修复
        // console.log(line.substr(start, end))
        yield JSON.parse(str).candidates[0].content.parts[0].text
      }
    }
  }
}
