const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const sm = require('sitemap')

const nunjucks = require('nunjucks')
const nunjucksRender = promisify(nunjucks.render)

const config = require('./site.config')
const distPath = config.build.distPath 
const layouts = config.layouts

module.exports = {

  build: () => {

    let env = nunjucks.configure('layouts')

    env.addFilter('sortByTime', function (arr, reversed, attr) {
        return arr.sort(function compare(a, b) {
            if (Date.parse(a[attr]) > Date.parse(b[attr])) {
                return reversed ? -1 : 1
            }
            if (Date.parse(a[attr]) < Date.parse(b[attr])) {
                return reversed ? 1 : -1
            }
            // if time was not definied put it at the end
            if (!a[attr]) {
                return 1
            }
            return 0
        })
    })

    env.addFilter('joinArray', function (arr, del, arrDel) {
        return arr.map(item => 
            item.join(del)
        ).join(arrDel)
    })

    // copy assets folder
    fs.copy('static', `${distPath}/static`)
    .catch(err => { console.error(err) })

    // read page templates
    // looking for .yaml files, return paths of found files
    // cwd: The current working directory in which to search 

    glob('**', { cwd: 'content' }) //glob('**/*.yaml', { cwd: 'content' })
        .then((files) => {
            config.preHook(files)
            return files
        })
        .then((files) => {

            let urls = []
            files.forEach((file) => {

                if (file.endsWith('.yaml')) {

                    // get info data
                    const fileInfo = path.parse(file)
                    // destination path without filename and extension 
                    const destDir = path.join(distPath, fileInfo.dir)
                    // defines a current working directory in which to search
                    // create destination directory
                    fs.mkdirsSync(destDir)
                    // render layout with page content
                    let layout
                    let data = yaml.safeLoad(fs.readFileSync(`content/${file}`))
                    data.Page = {}
                    // allow layouts to access absolute path
                    data.Page.path = fileInfo
                    // check if a costum layout file was specified (with a rule)
                    for (let rule of layouts) {
                        if (`content/${file}`.includes(rule.path)) {
                            layout = rule.layout
                            let url = {
                                url: rule.path,
                                changefreq: 'weekly',
                                priority: rule.priority,
                                lastmodrealtime: true,
                                lastmodfile: `content/${file}`
                            }
                            urls.push(url)
                            let ruleData = rule.data
                            if (ruleData) {
                                if (ruleData.indexOf('static/') === -1)
                                    ruleData = `static/${ruleData}`
                                if (ruleData.indexOf('.yaml') === -1)
                                    ruleData = `${ruleData}.yaml`
                                data.Data = (yaml.safeLoad(fs.readFileSync(`${distPath}/${ruleData}`)))
                            }
                            break
                        }
                    } 
                    if (layout) {
                        fs.writeFile(`${destDir}/${fileInfo.name}.html`, nunjucksRender(layout, data))
                            .catch((err) => { console.error(err) })
                    }
                } else if (file.indexOf('.') !== -1) {
                    fs.copy(`content/${file}`, `${distPath}/${file}`)
                        .catch(err => { console.error(err) })
                }
                
            })
            let sitemap = sm.createSitemap({
                hostname: 'https://www.shortlib.com',
                cacheTime: 600000,  //600 sec (10 min) cache purge period
                urls: urls
            })
            fs.writeFile(`${distPath}/sitemap.xml`, sitemap.toString())
                .catch((err) => { console.error(err) })
        })
        .catch((err) => { console.error(err) })

  }

}
  