import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const DIR = './projects/flowers-miniapp-portfolio/assets/bouquets'

// карточки каталога ~165px, фото товара ~300px — 600px перекрывает с запасом на ретину
const WIDTH = 600

const kb = (b) => (b / 1024).toFixed(0) + ' KB'

let totalBefore = 0, totalAfter = 0

const files = (await readdir(DIR)).filter(f => f.endsWith('.png'))
for (const file of files) {
    const src = join(DIR, file)
    const out = join(DIR, file.replace('.png', '.webp'))
    const sizeBefore = (await stat(src)).size
    await sharp(src)
        .resize(WIDTH, null, { withoutEnlargement: true })
        // alphaQuality:100 — иначе на полупрозрачных краях лепестков виден бандинг
        .webp({ quality: 82, alphaQuality: 100 })
        .toFile(out)
    const sizeAfter = (await stat(out)).size
    totalBefore += sizeBefore
    totalAfter += sizeAfter
    console.log(`${file.replace('.png', '')}:  ${kb(sizeBefore)} → ${kb(sizeAfter)}`)
}

console.log(`\nИТОГО: ${kb(totalBefore)} → ${kb(totalAfter)}  (−${Math.round((1 - totalAfter / totalBefore) * 100)}%)`)
