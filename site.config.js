const postHook = require('./posthook')

module.exports = {
  layouts: [
    { path: '/apps/', layout: 'app.njk' },
    { path: '/', layout: 'home.njk', data: 'categories.yaml' }
  ],
  build: {
    distPath: 'public',
    defaultLayout: 'default', /* necessary ? */
  },
  postHook: postHook.generateCategories,
  site: {
    title: 'ShortLib',
    description: ''
  }
}