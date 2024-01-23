import {
  reqGemini
} from '@/api'

const controller = new AbortController();

export const abort = controller.abort

export async function* llm(text, signal = controller.signal, type = 'gemi') {
  type = localStorage.getItem("llm-model") || "Gemini Pro"
  if (type == 'Gemini Pro') {
    for await (const line of (await reqGemini(typeof text === 'string' ? {
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
        const r = JSON.parse(str);
        if (r.error) {
          yield Promise.reject(r.error.message)
        } else {
          // 存在bug 已修复
          // console.log(line.substr(start, end))
          yield JSON.parse(str).candidates[0].content.parts[0].text
        }

      }
    }
  }
}
