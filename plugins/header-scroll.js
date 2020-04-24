import Vue from 'vue'

Vue.directive('header', {
  inserted: (el) => {
    if (isDesktop()) {
      const headerContainer = el.querySelector('.container')
      const containerTop = headerContainer.offsetTop
      watchScroll(el, containerTop)
      window.addEventListener('scroll', function(e) {
        watchScroll(el, containerTop)
      })
    }
  }
})

function watchScroll(header, containerTop) {
  const currentScroll = Math.abs(document.body.getBoundingClientRect().top)
  if (currentScroll > containerTop) {
    header.classList.add('header--fixed')
  } else {
    header.classList.remove('header--fixed')
  }
}
function isDesktop() {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  return width >= 1024
}
