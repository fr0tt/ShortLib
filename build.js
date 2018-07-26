const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const { promisify } = require('util')
const nunjucks = require('nunjucks')
const nunjucksRender = promisify(nunjucks.render)
const glob = promisify(require('glob'))

const config = require('./site.config')
const distPath = config.build.distPath 
const defaultLayout = config.build.defaultLayout
const layouts = config.layouts

// copy assets folder
fs.copy('static', `${distPath}/static`)  //fs.copy(srcPath + '/assets', `${distPath}/assets`) 
  .catch(err => { console.error(err) })

// read page templates
// looking for .json files, return paths of found files
// cwd: The current working directory in which to search

let categories = []

glob('**/*.yaml', { cwd: 'content' })
  .then((files) => {
    files.forEach((file) => {
      let data = yaml.safeLoad(fs.readFileSync(`content/${file}`))
      console.log(data.category)
      categories.push(data.category)
    })
  })
  .catch((err) => { console.error(err) })

glob('**/*.yaml', { cwd: 'content' })
  .then((files) => {
    files.forEach((file) => {
      // get info data
      const fileInfo = path.parse(file)

      // destination path without filename and extension 
      const destDir = path.join(distPath, fileInfo.dir)

      // defines a current working directory in which to search
      nunjucks.configure('layouts')
      // create destination directory
      fs.mkdirs(destDir)
        .then(() => {
          // render layout with page contents
          let layout = `${defaultLayout}.njk`
          layouts.forEach((rule) => {
            if (`content/${file}`.includes(rule.path)) {
              layout = rule.layout
            }
          })
          return nunjucksRender(layout, yaml.safeLoad(fs.readFileSync(`content/${file}`))) //require(`./content/${file}`)
        })
        .then((pageContent) => {
          // save the html file
          fs.writeFile(`${destDir}/${fileInfo.name}.html`, pageContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .then(() => {
    // execute function after building
    config.postHook()
  })
  .catch((err) => { console.error(err) })
  