const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

module.exports = {

  generateData: (distPath, files) => {

    let metainfo = []
    // collect category data of each file in content directory
    files.forEach((file) => {

		// only .yaml files found in apps directory
		if (file.startsWith('apps/') && file.endsWith('.yaml')) {

			const fileInfo = path.parse(file)
			const data = yaml.safeLoad(fs.readFileSync(`content/${file}`))
			/*const dataCategory = data.category
			
			if (dataCategory) {

			if (!categories[dataCategory]) {
				categories[dataCategory] = []
			}

			const fileInfo = path.parse(file)

			categories[dataCategory].push({ 
				name: data.name, 
				image_src: data.image_src,
				link: fileInfo.dir
			})

			}*/
			let newData = {}

			if (data.name)
				newData.name = data.name
			if (data.image_src)  
				newData.image_src = data.image_src
			if (data.category)
				newData.category = data.category
			if (data.time)
				newData.time = data.time

			/*
			newData.name = data.name || ''
			newData.image_src = data.image_src || ''
			newData.category = data.category || ''
			newData.time = data.time || ''
			*/

			newData.link = fileInfo.dir

			metainfo.push(newData)

    	}

    })

    fs.writeFileSync(`${distPath}/static/data.yaml`, yaml.safeDump({ 'metainfo': metainfo })) 

  }

}