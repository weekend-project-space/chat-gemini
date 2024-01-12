import {
  createVNode,
  render
} from 'vue'
import Alert from '@/components/Alert'
// 创建元素用来挂载虚拟 DOM 
const div = document.createElement('div')
document.body.appendChild(div)

export default ({
  text,
  type = 'success'
}) => {
  let timer = null
  // 创建虚拟 DOM
  const VNode = createVNode(Alert, {
    text,
    type
  })
  render(VNode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
