import {
  reqGemini
} from '@/api'

const controller = new AbortController();

export const abort = controller.abort

export async function* llm(data, signal = controller.signal, type = 'gemi') {
  type = localStorage.getItem("llm-model") || "Gemini Pro"
  if (type == 'Gemini Pro') {
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
        "name": "mindMap",
        "description": "- Role: 大纲生成助理生成思维导图\n- Description: 旨在帮助用户根据主题编写markdown格式文本的主题大纲， 要求逻辑清晰，层级分明，分条表述。层级不能少于4级",
        "parameters": {
          "properties": {
            "content": {
              "description": "以#开头的markdown格式文本",
              "type": "string"
            }
          },
          "required": [],
          "type": "object"
        }
      }]
    }]
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
              data: JSON.stringify(part.functionCall)
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
