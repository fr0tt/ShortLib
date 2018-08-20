const util = require('./util')

module.exports = {
  site: {
    title: 'ShortLib',
    description: ''
  },
  build: {
    distPath: 'public'
  },
  layouts: [
    { path: '/apps/', layout: 'app.njk' },
    { path: '/index', layout: 'index.njk', data: 'data.yaml' },
    { path: '/contact', layout: 'contact.njk' },
    { path: '/legal_notice', layout: 'legal_notice.njk' }
  ],
  preHook: ((files) => {
    util.generateData('public', files)
  })
}