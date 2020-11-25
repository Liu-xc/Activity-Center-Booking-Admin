export function filterParams(data) {
  const params = {}
  const keys = Object.keys(data)
  for (const item of keys) {
    if (data[item] === '' || data[item] === undefined || data[item] === null) {
      continue
    }
    params[item] = data[item]
  }

  return params
}
