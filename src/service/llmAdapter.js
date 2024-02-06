import {
  reqGemini
} from '@/api'

const controller = new AbortController();

export const abort = controller.abort

export async function* llm(data, signal = controller.signal, disabledTools = false, type = 'gemi') {
  type = localStorage.getItem("llm-model") || "Gemini Pro"
  if (type == 'Gemini Pro') {
    if (!disabledTools) {
      data.tools = [{
        "functionDeclarations": [{
          "name": "find_weather",
          "description": "获取当前天气",
          "parameters": {
            "type": "OBJECT",
            "properties": {
              "location": {
                "type": "STRING",
                "description": "地区名称"
              },
              "description": {
                "type": "STRING",
                "description": "任何类型的描述，包括类别或流派、标题词、属性等。"
              }
            },
            "required": ["description"]
          }
        }, {
          "name": "find_webcrawer",
          "description": "查找网络信息，网络爬虫",
          "parameters": {
            "type": "OBJECT",
            "properties": {
              "url": {
                "type": "STRING",
                "description": "url,网址"
              },
              "summarize": {
                "type": "BOOLEAN",
                "description": "是否需要总结"
              },
            },
            "required": ["url", "summarize"]
          }
        }, {
          "name": "find_currenttime",
          "description": "获取当前时间",
        }]
      }]
    }
    for await (const line of (await reqGemini(data, signal))) {
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
          let part = JSON.parse(str).candidates[0].content.parts[0]
          if (part.text) {
            yield {
              type: 'text',
              data: part.text
            }
          } else if (part.functionCall) {
            yield {
              type: 'functionCall',
              data: part.functionCall
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
}
