export default function (array, searchKey) {
  return array.filter(obj => {
    return Object.keys(obj).some(key => {
      return String(obj[key]).toLowerCase().indexOf(searchKey.toLowerCase()) > -1
    })
  })
}
