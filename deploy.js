import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const run = (cmd, cwd = '.') => execSync(cmd, { stdio: 'inherit', cwd, shell: true })

// собираем билд
run('npm run build')

// копируем проекты в dist через PowerShell — Node cpSync глючит с Windows на этом пути
execSync(`powershell -Command "Copy-Item -Recurse -Force 'projects' 'dist/projects'"`, { stdio: 'inherit' })
writeFileSync('dist/.nojekyll', '')

// временная папка для git — вне проекта, чтобы не мусорить в dist
const tmp = join(tmpdir(), 'lusty-deploy-' + Date.now())
mkdirSync(tmp)

try {
    // копируем готовый билд во временную папку
    execSync(`powershell -Command "Copy-Item -Recurse -Force 'dist/*' '${tmp}'"`, { stdio: 'inherit' })

    run('git init', tmp)
    run('git add -A', tmp)
    run('git commit -m deploy', tmp)
    run('git remote add origin https://github.com/lusty1337/lusty1337.github.io.git', tmp)
    run('git -c http.proxy="" push -f origin HEAD:gh-pages', tmp)

    console.log('\nготово — сайт обновится на lusty1337.github.io через ~1 мин')
} finally {
    try {
        execSync(`powershell -Command "Remove-Item -Recurse -Force '${tmp}'"`, { stdio: 'ignore' })
    } catch { /* не критично */ }
}
