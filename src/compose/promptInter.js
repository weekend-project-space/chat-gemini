import {
  ref
} from 'vue'

export default function (instrs) {
  let _data = {}
  const compoents = [];
  // init
  for (let instr of instrs) {
    _data[instr.name] = undefined
    compoents.push({
      name: instr.name,
      type: instr.type,
      value: instr.value,
    })
  }

  const data = ref(_data)

  function rest() {
    _data = {}
    for (let instr of instrs) {
      _data[instr.name] = undefined
    }
    data.value = _data
  }

  function inter() {
    const instr = instrs[instrs.lenght - 1]
    if (instr.type == 'instr') {
      return replace(instr.value, data.value)
    } else {
      throw "instr value error"
    }
  }

  return {
    data,
    compoents,
    rest,
    inter
  }
}

// 将${a}变成取变量
function replace(exp, env) {
  let index = exp.indexOf('${')
  let end = exp.indexOf("}")
  if (index > -1 && end > 0) {
    let key = exp.substring(index + 2, end)
    return replace(exp.substring(0, index) + env[key] + exp.substring(end + 1), env)
  } else {
    return exp
  }
}
