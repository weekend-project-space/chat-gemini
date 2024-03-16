export function flatPrompt2Instr(prompt) {
  const array = identifyCurlyBraces(prompt);
  return array.map(item => parseComp(item))
}

function parseComp(instr) {
  if (instr.includes(' = ')) {
    const a = instr.trim().split(' = ')
    const index = a[0].indexOf(' ');
    const left = instr.substr(0, index)
    const value = eval(a[1].trim())
    return {
      type: left,
      name: a[0].substr(index + 1),
      value
    }
  } else {
    return {
      type: 'instr',
      value: instr
    }
  }
}

// p div input textarea checkbox select 
// (p a = 12356465789)
// (input a = [1,2,3,4,5,6,7])
// (input b = )
// (123456${a}sdfdsf${b})
// filename 

/**
 * 识别字符串中的{{}}并返回其内容
 *
 * @param {string} input 输入字符串
 * @returns {array} 识别到的内容数组
 */
const identifyCurlyBraces = (input) => {
  if (!input) {
    return []
  }
  // 使用正则表达式识别()中的内容 包含换行符
  // const regex = /\((.+?)\)/g;
  const regex = /\(([\s\S]+?)\)/g;

  // 匹配所有符合正则表达式的子字符串
  const matches = input.match(regex);

  // 如果没有匹配项，则返回空数组
  if (!matches) {
    return [];
  }

  // 提取匹配项中的内容并返回
  return matches.map((match) => match.slice(1, -1));
};
