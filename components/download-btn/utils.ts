/**
 * @description base64 url 转为 Blob对象
 * @param urlData base64 url {string}
 * @returns blob对象
 */
export function convertBase64UrlToBlob (urlData: string) {
  // dataURL 的格式为 “data:image/png;base64,****”
  // 只需要逗号之后的就行了,并且用window.atob转为二进制
  let bytes = window.atob(urlData.split(',')[1])
  // 取得图片MIME类型
  let mimeString = urlData.split(',')[0].split(':')[1].split(';')[0]
  // 处理异常,将字符串字节转为TypedArray
  let ia = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }

  return new Blob([ia], {type: mimeString})
}