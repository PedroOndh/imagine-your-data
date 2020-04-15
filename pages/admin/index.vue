<template>
  <div></div>
</template>

<style lang="scss">
aside a {
  & span {
    display: inline-flex !important;
    justify-content: center;
    align-items: center;
    & svg {
      display: none !important;
    }

    &::before {
      font-family: 'empathy-icons';
      font-size: 1rem;
    }
  }
  &[href='#/collections/blog'] span::before {
    content: '\e909';
  }
  &[href='#/collections/categories'] span::before {
    content: '\e904';
  }
  &[href='#/collections/authors'] span::before {
    content: '\e945';
  }
  &[href='#/collections/quotes'] span::before {
    content: '\e93b';
  }
  &[href='#/collections/pages'] span::before {
    content: '\e927';
  }
}
</style>

<script>
if (process.client) {
  import('netlify-cms').then((cms) => {
    cms.registerPreviewStyle(
      'https://assets.empathybroker.com/resources/fonts/empathy-typography/style.css'
    )
    cms.registerPreviewStyle('/admin/admin.css')
    cms.registerEditorComponent({
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
    cms.registerEditorComponent({
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
            return `<iframe src="https://www.youtube.com/embed/${
              urlParams.split('&')[0]
            }" frameborder="0" allowfullscreen></iframe>`
          }
        }
      },
      toPreview: (obj) => {
        if (obj.url) {
          const urlParams = obj.url.split('=')[1]
          if (urlParams) {
            return `<iframe src="https://www.youtube.com/embed/${
              urlParams.split('&')[0]
            }" frameborder="0" allowfullscreen></iframe>`
          }
        }
      }
    })
  }) // eslint-disable-line
}

export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://assets.empathybroker.com/resources/fonts/empathy-icons/style.css'
        }
      ]
    }
  }
}
</script>
