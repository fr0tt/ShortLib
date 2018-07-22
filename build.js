const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const nunjucks = require('nunjucks')
const nunjucksRender = promisify(nunjucks.render)
const glob = promisify(require('glob'))
const config = require('./site.config')

const distPath = config.build.distPath 

// copy assets folder
fse.copy('static', `${distPath}/static`)  //fse.copy(srcPath + '/assets', `${distPath}/assets`) 
  .catch(err => {
    console.error(err)     //https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
  })

// read page templates
// looking for .json files, return paths of found files
// cwd: The current working directory in which to search

glob('**/*.json', { cwd: 'content' })
  .then((files) => {
    files.forEach((file) => {
      // get info data
      const fileInfo = path.parse(file)

      // combine distPath and dir of a found .njk file 
      const destPath = path.join(distPath, fileInfo.dir)
      console.log(destPath)

      // defines a current working directory in which to search
      nunjucks.configure('layouts')
      // create destination directory
      fse.mkdirs(destPath)
        .then((pageContents) => {
          // render layout with page contents
          console.log(pageContents)
          return nunjucksRender('base.njk', require(`./content/${file}`))
        })
        .then((layoutContent) => {
          // save the html file
          fse.writeFile(`${destPath}/${fileInfo.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })