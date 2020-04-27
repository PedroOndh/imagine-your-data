export const turnFileNameToPath = (slug) => slug.slice(11)
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
export const isDesktop = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  return width >= 1024
}
