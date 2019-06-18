/**
 * @param  {[String]} data dataURL “data:image/png;base64,****”
 * @param  {[String]} mime [description]
 * @return {[blob]}      [description]
 */
export default function (data, mime) {
  data = data.split(',')[1]
  data = window.atob(data)
  var ia = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  // canvas.toDataURL
  return new Blob([ia], {
    type: mime
  })
}
