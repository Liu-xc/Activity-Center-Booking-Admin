export function getUrlParams(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i') // 定义正则表达式
  var r = url.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
