import Vue from 'vue'

Vue.directive('lightbox', {
  inserted: (el) => {
    activateLightbox(el)
  }
})

function activateLightbox(element) {
  initLightboxBehaviour()
  window.addEventListener('resize', initLightboxBehaviour)
  function onClickMediaElement(e) {
    e.preventDefault()
    openLightBox(e.target)
  }
  function initLightboxBehaviour() {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (width <= 1023) {
      element.removeEventListener('click', onClickMediaElement)
    } else {
      element.addEventListener('click', onClickMediaElement)
    }
  }

  const lightBox = {}

  function openLightBox(mediaElement) {
    if (!document.getElementById('lightbox')) {
      createLightbox(mediaElement)
      createCloneInLightBox(mediaElement)
      lightBox.media.classList.toggle('lightbox__media--initial-position')
    }
  }
  function createLightbox() {
    const lightBoxContainer = document.createElement('aside')
    const lightBoxContent = document.createElement('figure')
    const lightBoxCloseBtn = document.createElement('span')

    lightBox.container = lightBoxContainer
    lightBox.content = lightBoxContent
    lightBox.closeBtn = lightBoxCloseBtn

    lightBox.container.className = 'lightbox__container'
    lightBox.content.className = 'lightbox__content'
    lightBox.closeBtn.className = 'lightbox__close-btn'

    lightBoxContainer.appendChild(lightBoxContent)
    lightBoxContent.appendChild(lightBoxCloseBtn)
    lightBoxCloseBtn.innerHTML = '<img src="/_media/times.svg" />'
    document.body.appendChild(lightBoxContainer)

    lightBoxContainer.addEventListener('click', (e) => {
      if (e.target !== lightBox.media) {
        closeLightBox()
      }
    })
  }
  function closeLightBox() {
    lightBox.container.classList.add('lightbox__container--animation-close')
    lightBox.media.classList.remove('lightbox__media--initial-position')
    deleteLightBox()
  }
  function createCloneInLightBox(mediaElement) {
    const tag = mediaElement.tagName
    let lightBoxMedia
    if (tag === 'VIDEO') {
      lightBoxMedia = mediaElement.cloneNode(true, 'lightbox__media')
      lightBoxMedia.style.width = `${mediaElement.clientWidth}px`
      lightBoxMedia.style.height = `${mediaElement.clientHeight}px`
      lightBoxMedia.setAttribute('controls', '')
    } else {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      const isImageHorizontal =
        mediaElement.offsetWidth > (mediaElement.offsetHeight * width) / height
      const image = new Image()
      image.src = mediaElement.src
      image.style.width = isImageHorizontal ? '100%' : 'auto'
      image.style.height = isImageHorizontal ? 'auto' : '100%'
      lightBoxMedia = image
      lightBoxMedia.classList.add('lightbox__media--images')
    }
    lightBox.content.appendChild(lightBoxMedia)
    lightBox.media = lightBoxMedia
    lightBox.media.className = 'lightbox__media'
  }
  function deleteLightBox() {
    lightBox.content.removeChild(lightBox.media)
    document.body.removeChild(lightBox.container)
  }
}
