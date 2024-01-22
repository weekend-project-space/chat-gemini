import {
  createVNode,
  render
} from 'vue'
import Confirm from '@/components/Confirm'
// 创建元素用来挂载虚拟 DOM 
const div = document.createElement('div')
document.body.appendChild(div)

export default ({
  text,
  type = 'success',
  confirmText = "确认",
  cancelText = "取消"
}) => {
  // 创建虚拟 DOM
  return new Promise((resolve, reject) => {
    const cancel = () => {
      render(null, div)
      reject()
    }
    const confirm = () => {
      render(null, div)
      resolve()
    }
    const VNode = createVNode(Confirm, {
      text,
      type,
      confirm,
      cancel,
      confirmText,
      cancelText
    })
    render(VNode, div)
  })

}
