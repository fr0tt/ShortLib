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
    { path: '/legal_notice', layout: 'imprint.njk' }
  ],
  preHook: ((files) => {
    util.generateData('public', files)
  })
}