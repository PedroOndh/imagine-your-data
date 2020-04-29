import Vue from 'vue'

Vue.directive('header', {
  inserted: (el) => {
    const headerContainer = el.querySelector('.container')
    const containerTop = headerContainer.offsetTop
    watchScroll(el, containerTop, 'header--fixed')
    window.addEventListener('scroll', function(e) {
      watchScroll(el, containerTop, 'header--fixed')
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
