import {
  ref,
  watch
} from 'vue'
import {
  flatPrompt2Instr
} from '@/service/promptInstr'

export function useInter(props) {
  const r = ref(interpreter(flatPrompt2Instr(props.prompt)))
  watch(props, () => {
    const instrs = flatPrompt2Instr(props.prompt)
    r.value = interpreter(instrs)
  })
  return r
}

export function interpreter(instrs) {
  let _data = {}
  const components = [];
  // init
  for (let instr of instrs) {
    if (instr.type != 'instr') {
      _data[instr.name] = instr.type == 'radio' || instr.type == 'select' ? instr.value[0] : undefined
      components.push({
        name: instr.name,
        type: instr.type,
        value: instr.value,
      })
    }

  }

  const data = ref(_data)

  function rest() {
    for (let instr of instrs) {
      if (instr.type != 'instr') {
        data.value[instr.name] = instr.type == 'radio' || instr.type == 'select' ? instr.value[0] : undefined
      }
    }
  }

  function inter() {
    const instr = instrs[instrs.length - 1]
    if (instr.type == 'instr') {
      return render(instr.value, data.value)
    } else {
      throw "instr value error"
    }
  }
  const hasAllValue = ref(false)
  watch(data, () => {
    let array = []
    for (let key in data.value) {
      let v = data.value[key]
      if (v) {
        array.push(v)
      }
    }
    hasAllValue.value = array.length == Object.keys(data.value).length
  }, {
    deep: true
  })


  return {
    data,
    components,
    rest,
    inter,
    hasAllValue
  }
}
// function render(key...){return `${key}`}

// 将${a}变成取变量
// function replace(exp, env) {
//   let index = exp.indexOf('${')
//   let end = exp.indexOf("}")
//   if (index > -1 && end > 0) {
//     let key = exp.substring(index + 2, end)
//     const v = env[key.trim()];
//     return replace(exp.substring(0, index) + (v ? v : '') + exp.substring(end + 1), env)
//   } else {
//     return exp
//   }
// }


function render(exp0, env) {
  console.log(exp0, env)
  const {
    exp,
    params,
    values
  } = getFunInfo(exp0, env)
  console.log(exp, params, values)
  return new Function(...params, `return \`${exp}\``)(...values)
}

function getFunInfo(exp, env) {
  let params = []
  let values = []
  // trimed = exp.trim()
  while (exp.indexOf('${') > -1) {
    let index = exp.indexOf('${')
    let end = exp.indexOf("}")
    let key = exp.substring(index + 2, end).trim()
    const v = env[key];
    key = 'args' + index
    values.push(v)
    params.push(key)
    exp = exp.substring(0, index) + (v ? '$$[' + key + '$$]' : '') + exp.substring(end + 1)
  }
  return {
    params,
    values,
    exp: exp.replaceAll('$$[', '${').replaceAll('$$]', '}')
  }
}
