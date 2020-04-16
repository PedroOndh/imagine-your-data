export default function activateLightbox() {
  const media = document.querySelectorAll('.lightbox')

  if (document.querySelectorAll('.lightbox').length > 0) {
    initLightboxBehaviour()
    window.addEventListener('resize', initLightboxBehaviour)
  }
  function onClickMediaElement(e) {
    e.preventDefault()
    openLightBox(e.target)
    disableScroll()
  }
  function initLightboxBehaviour() {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (width <= 1023) {
      media.forEach((mediaElement) =>
        mediaElement.removeEventListener('click', onClickMediaElement)
      )
    } else {
      media.forEach((mediaElement) =>
        mediaElement.addEventListener('click', onClickMediaElement)
      )
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
    lightBoxCloseBtn.textContent = 'X'
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
      const image = new Image(
        mediaElement.offsetWidth,
        mediaElement.offsetHeight
      )
      image.src = mediaElement.src
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
    enableScroll()
  }
  function preventDefault(e) {
    e.preventDefault()
    e.returnValue = false
  }
  function preventDefaultForScrollKeys(e) {
    preventDefault(e)
    return false
  }
  function disableScroll() {
    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', preventDefault, false)
    }
    document.addEventListener('wheel', preventDefault, { passive: false })
    window.onwheel = preventDefault
    window.onmousewheel = document.onmousewheel = preventDefault
    window.ontouchmove = preventDefault
    document.onkeydown = preventDefaultForScrollKeys
  }
  function enableScroll() {
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', preventDefault, false)
    }
    document.removeEventListener('wheel', preventDefault, { passive: false })
    window.onmousewheel = document.onmousewheel = null
    window.onwheel = null
    window.ontouchmove = null
    document.onkeydown = null
  }
}
