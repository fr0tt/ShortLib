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

let categories = []

// read page templates
// looking for .json files, return paths of found files
// cwd: The current working directory in which to search

glob('**/*.yaml', { cwd: 'content' })
  .then((files) => {
    // collect category data of each file in content directory
    files.forEach((file) => {
      let data = yaml.safeLoad(fs.readFileSync(`content/${file}`))
      if (data.category)
        categories.push(data.category)
    })
    return files
  })
  .then((files) => {
    // create and write or overwrite file with category data 
    fs.writeFileSync(`${distPath}/static/categories.yaml`, yaml.safeDump({ 'categories': categories}) )
    return files
  })
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
          // render layout with page content
          let layout = `${defaultLayout}.njk`
          let data = yaml.safeLoad(fs.readFileSync(`content/${file}`))
          // check if a costum layout file was specified (with a rule)
          for (let rule of layouts) {
            console.log(file + ' ' + rule.path)
            if (`content/${file}`.includes(rule.path)) {
              layout = rule.layout
              if (rule.data && rule.data.indexOf('.yaml') !== -1) {
                data.Data = (yaml.safeLoad(fs.readFileSync(`${distPath}/static/${rule.data}`)))
              }
              break
            }
          }
          return nunjucksRender(layout, data)
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
  