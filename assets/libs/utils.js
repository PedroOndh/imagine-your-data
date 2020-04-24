export const turnFileNameToPath = (slug) => slug.slice(11)
export const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
export const trunc = (string, n, useWordBoundary) => {
  if (string.length <= n) {
    return string
  }
  const subString = string.substr(0, n - 1)
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + '...'
  )
}
