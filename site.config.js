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
    { path: '/apps/', layout: 'app.njk', priority: 0.80 },
    { path: '/index', layout: 'index.njk', data: 'data.yaml', priority: 1.00 },
    { path: '/contact', layout: 'contact.njk', priority: 0.20 },
    { path: '/legal_notice', layout: 'legal_notice.njk', priority: 0.20 }
  ],
  preHook: ((files) => {
    util.generateData('public', files)
  })
}