import CMS from 'netlify-cms'

CMS.registerPreviewStyle(
  'https://assets.empathybroker.com/resources/fonts/empathy-typography/style.css'
)
CMS.registerPreviewStyle('/admin/admin.css')
CMS.registerEditorComponent({
  id: 'video',
  label: 'Video',
  fields: [
    { name: 'id', label: 'video', widget: 'file' },
    {
      name: 'poster',
      label: 'Poster image',
      widget: 'file',
      required: false,
      default: ''
    }
  ],
  pattern: /^<video ([\s\S]*?) poster="([\s\S]*?)"><source src="([\s\S]*?)" ([\s\S]*?)><\/video>$/,
  fromBlock: (match) => {
    return {
      id: match[3],
      poster: match[2]
    }
  },
  toBlock: (obj) => {
    return `<video controls poster="${obj.poster}"><source src="${obj.id}" type="video/mp4"></video>`
  },
  toPreview: (obj) => {
    return `<video controls poster="${obj.poster}"><source src="${obj.id}" type="video/mp4"></video>`
  }
})
CMS.registerEditorComponent({
  id: 'youtube',
  label: 'Youtube Video',
  fields: [{ name: 'url', label: 'Youtube Video URL', widget: 'string' }],
  pattern: /^<iframe src="\/\/www.youtube.com\/embed\/(.*)" frameborder="0" allowfullscreen><\/iframe>/,
  fromBlock: (match) => {
    return {
      url: match[1]
    }
  },
  toBlock: (obj) => {
    if (obj.url) {
      const urlParams = obj.url.split('=')[1]
      if (urlParams) {
        return `<iframe class="external-video" src="https://www.youtube.com/embed/${
          urlParams.split('&')[0]
        }" frameborder="0" allowfullscreen></iframe>`
      }
    }
  },
  toPreview: (obj) => {
    if (obj.url) {
      const urlParams = obj.url.split('=')[1]
      if (urlParams) {
        return `<iframe class="external-video" src="https://www.youtube.com/embed/${
          urlParams.split('&')[0]
        }" frameborder="0" allowfullscreen></iframe>`
      }
    }
  }
})
CMS.registerEditorComponent({
  id: 'image-figcaption',
  label: 'Complex Image',
  fields: [
    {
      name: 'image',
      label: 'image',
      widget: 'image'
    },
    {
      name: 'caption',
      label: 'image Caption',
      widget: 'string',
      default: ''
    },
    {
      name: 'lightbox',
      label: 'Lightbox available?',
      widget: 'boolean'
    }
  ],
  pattern: /^<complex-image image="([\s\S]*?)" caption="([\s\S]*?)" lightbox="([\s\S]*?)" ([\s\S]*?)><\/complex-image>$/,
  fromBlock: (match) => {
    return {
      image: match[1],
      caption: match[2],
      lightbox: match[3]
    }
  },
  toBlock: (obj) => {
    // eslint-disable-next-line
    return `<complex-image image="${obj.image}" caption="${obj.caption}" lightbox="${obj.lightbox}" ${obj.lightbox ? 'v-lightbox' : ''}></complex-image>`
  },
  toPreview: (obj) => {
    // eslint-disable-next-line
    return `<figure itemscope itemtype="http://schema.org/ImageObject" class="image-figcaption"><img src="${obj.image}" alt="${obj.caption}" />${obj.caption ? `<figcaption itemprop="caption" class="text-centered">${obj.caption}</figcaption>` : '' }</figure>`
  }
})
CMS.registerEditorComponent({
  id: 'custom-iframe',
  label: 'Iframe',
  fields: [
    {
      name: 'src',
      label: 'Source',
      widget: 'string'
    },
    {
      name: 'desktopHeight',
      label: 'Desktop height (compulsory)',
      widget: 'string'
    },
    {
      name: 'tabletHeight',
      label: 'Tablet height',
      widget: 'string'
    },
    {
      name: 'mobileHeight',
      label: 'Mobile height',
      widget: 'string'
    },
    {
      name: 'otherAttributes',
      label: 'Custom Attributes',
      widget: 'string'
    }
  ],
  pattern: /^<iyd-iframe src="([\s\S]*?)" desktop-height="([\s\S]*?)" tablet-height="([\s\S]*?)" mobile-height="([\s\S]*?)" ([\s\S]*?)><\/iyd-iframe>$/,
  fromBlock: (match) => {
    return {
      src: match[1],
      desktopHeight: match[2],
      tabletHeight: match[3],
      mobileHeight: match[4],
      otherAttributes: match[5]
    }
  },
  toBlock: (obj) => {
    // eslint-disable-next-line
    return `<iyd-iframe src="${obj.src}" desktop-height="${obj.desktopHeight}" tablet-height="${obj.tabletHeight}" mobile-height="${obj.mobileHeight}" ${obj.otherAttributes}></complex-image>`
  },
  toPreview: (obj) => {
    return `<iframe src="${obj.src}" height="${obj.desktopHeight}"></iframe>`
  }
})
