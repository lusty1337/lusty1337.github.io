import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const BASE = './projects/pizza-landing-portfolio/assets'
const DIRS = ['pizzas', 'appetizers', 'drinks', 'desserts']

// карточки меню ~280px, герой ~560px — 600px перекрывает всё с запасом на ретину
const WIDTH = 600

const kb = (b) => (b / 1024).toFixed(0) + ' KB'

let totalBefore = 0, totalAfter = 0

for (const dir of DIRS) {
    const files = (await readdir(join(BASE, dir))).filter(f => f.endsWith('.png'))
    for (const file of files) {
        const src = join(BASE, dir, file)
        const out = join(BASE, dir, file.replace('.png', '.webp'))
        const sizeBefore = (await stat(src)).size
        await sharp(src)
            .resize(WIDTH, null, { withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(out)
        const sizeAfter = (await stat(out)).size
        totalBefore += sizeBefore
        totalAfter  += sizeAfter
        console.log(`${dir}/${file.replace('.png','')}:  ${kb(sizeBefore)} → ${kb(sizeAfter)}`)
    }
}

console.log(`\nИТОГО: ${kb(totalBefore)} → ${kb(totalAfter)}  (−${Math.round((1 - totalAfter/totalBefore)*100)}%)`)
