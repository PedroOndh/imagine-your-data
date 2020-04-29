import Vue from 'vue'

Vue.directive('header', {
  inserted: (el) => {
    const headerTop = el.offsetTop
    watchScroll(el, headerTop, 'header--fixed')
    window.addEventListener('scroll', function(e) {
      watchScroll(el, headerTop, 'header--fixed')
    })
  }
})

function watchScroll(element, elementTop, classToToggle) {
  const currentScroll = Math.abs(document.body.getBoundingClientRect().top)
  if (currentScroll > elementTop) {
    element.classList.add(classToToggle)
  } else {
    element.classList.remove(classToToggle)
  }
}
