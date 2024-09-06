import {
  reqChat
} from '@/api'

const controller = new AbortController();

export const abort = controller.abort

export async function* llm(message, signal = controller.signal) {
  for await (const line of (await reqChat(message, signal))) {
    if (line.includes('{') || line.includes('}')) {
      const start = line.indexOf('{')
      const end = line.lastIndexOf('}')
      let str = ''
      for (let i = start; i <= end; i++) {
        str += line.charAt(i)
      }
      const r = JSON.parse(str);
      if (r.error) {
        yield Promise.reject(r.error.message)
      } else {
        // 存在bug 已修复
        // console.log(line.substr(start, end))
        let message = JSON.parse(str).choices[0].message
        if (message.content) {
          yield {
            type: 'text',
            data: message.content
          }
        } else {
          yield {
            type: 'text',
            data: '出现点问题，请重试'
          }
        }
      }

    }
  }
}
