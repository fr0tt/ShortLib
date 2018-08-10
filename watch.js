const handler = require('serve-handler')
const http = require('http')
const chokidar = require('chokidar')

const config = require('./site.config')
const build = require('./main')


const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  return handler(request, response, {
    public: 'public'
  })
})

server.listen(5000, () => {
  console.log('\x1b[32m', 'Running at http://localhost:5000', '\x1b[0m')
})

// build app
build.build()

chokidar.watch('.', { 
    ignored: ['.git', '.gitignore', 'node_modules', 'package.json', 'package-lock.json',
      config.build.distPath, 'build.js', 'main.js', 'site.config.js'], 
    ignoreInitial: true
    })
    .on('all', (event, path) => {
        build.build()
    })
