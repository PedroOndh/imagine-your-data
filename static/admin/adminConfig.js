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
      name: 'caption_alignment',
      label: 'caption Alignment',
      widget: 'select',
      default: 'right',
      options: ['left', 'center', 'right']
    },
    {
      name: 'lightbox',
      label: 'Lightbox available?',
      widget: 'boolean'
    }
  ],
  pattern: /^<complex-image image="([\s\S]*?)" caption="([\s\S]*?)" caption-alignment="([\s\S]*?)" lightbox="([\s\S]*?)" ([\s\S]*?)><\/complex-image>$/,
  fromBlock: (match) => {
    return {
      image: match[1],
      caption: match[2],
      caption_alignment: match[3],
      lightbox: match[4]
    }
  },
  toBlock: (obj) => {
    // eslint-disable-next-line
    return `<complex-image image="${obj.image}" caption="${obj.caption}" caption-alignment="${obj.caption_alignment}" lightbox="${obj.lightbox}" ${obj.lightbox ? 'v-lightbox' : ''}></complex-image>`
  },
  toPreview: (obj) => {
    // eslint-disable-next-line
    return `<figure itemscope itemtype="http://schema.org/ImageObject" class="image-figcaption figcaption--align-${obj.caption_alignment}"><img src="${obj.image}" alt="${obj.caption}" />${obj.caption ? `<figcaption itemprop="caption">${obj.caption}</figcaption>` : '' }</figure>`
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
CMS.registerEditorComponent({
  id: 'carousel',
  label: 'Carousel',
  fields: [
    {
      name: 'slides',
      label: 'Slides',
      widget: 'list',
      types: [
        {
          label: 'Slide',
          name: 'slide',
          widget: 'object',
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
              name: 'caption_alignment',
              label: 'caption Alignment',
              widget: 'select',
              default: 'right',
              options: ['left', 'center', 'right']
            },
            {
              name: 'lightbox',
              label: 'Lightbox available?',
              widget: 'boolean'
            }
          ]
        }
      ]
    }
  ],
  pattern: /^<carousel slides="([\s\S]*?)"><\/carousel>$/,
  fromBlock: (match) => {
    if (match[1]) {
      const slides = JSON.parse(match[1].split('|/').join('"'))
      return {
        slides
      }
    } else {
      return {
        slides: []
      }
    }
  },
  toBlock: (obj) => {
    const finalSlides = obj.slides.map((slide) => {
      return {
        ...slide,
        caption: slide.caption.split('"').join("''"),
        lightbox: slide.lightbox ? 'lightbox' : ''
      }
    })
    return `<carousel slides="[${finalSlides.map((slide) =>
      JSON.stringify(slide)
        .split('"')
        .join('|/')
    )}]"></carousel>`
  },
  toPreview: (obj) => {
    return `<div class="carousel">${obj.slides.map(
      (slide) => `<img class="carousel__image" src="${slide.image}" />`
    )}</div>`
      .split(',')
      .join('')
  }
})
