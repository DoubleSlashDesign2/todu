const packager = require('electron-packager')
const png2icons = require('png2icons')
const path = require('path')
const fs = require('fs')

const ICON_PATH = 'src/resources/img/icon.ico'

// Check icon file
try {
  fs.accessSync(ICON_PATH)
} catch (error) {
  console.log('Generating program icon...')
  const folder = path.dirname(ICON_PATH)
  const input = fs.readFileSync(`${folder}/icon.png`)
  // eslint-disable-next-line new-cap
  const output = png2icons.PNG2ICO_BMP(input, png2icons.BICUBIC, false)
  fs.writeFileSync(ICON_PATH, output)
}

const options = {
  dir: '.',
  name: 'todu',
  out: 'dist/',
  overwrite: true,
  icon: ICON_PATH,
  ignore: [
    '^/(?!src|package\\.json|window\\.js)',
    '^/src/(storage|components|plugins)($|/)',
    '^/src/storage/.*_$',
  ],
  win32metadata: {
    FileDescription: 'TODU',
    OriginalFilename: 'todu.exe',
  }
}

packager(options).then(appPaths => {
  appPaths.forEach(dir => {
    if (dir.includes('win32')) {
      const manifest = 'todu.VisualElementsManifest.xml'
      fs.createReadStream(manifest)
        .pipe(fs.createWriteStream(`${dir}/${manifest}`))
    }
  })
  console.log('Build finished.')
}).catch(e => {
  console.error(e)
})
