const postHook = require('./posthook')

module.exports = {
  layouts: [
    { path: 'apps/', layout: 'app.njk' }
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