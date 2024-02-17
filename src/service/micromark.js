import {
  micromark
} from 'micromark'
import {
  gfm,
  gfmHtml
} from 'micromark-extension-gfm'
// import {
//   math,
//   mathHtml
// } from 'micromark-extension-math'
// const markOption = {
//   allowDangerousHtml: true,
//   allowDangerousProtocol: true,
//   extensions: [gfm(), math()],
//   htmlExtensions: [gfmHtml(), mathHtml({
//     strict: false
//   })]
// }
const markOption = {
  allowDangerousHtml: true,
  allowDangerousProtocol: true,
  extensions: [gfm()],
  htmlExtensions: [gfmHtml()]
}
export default (v) => v.indexOf('<iframe') == 0 ? v : micromark(v, markOption)
