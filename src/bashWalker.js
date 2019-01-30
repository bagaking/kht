import { exec } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

const run = cmd => {
  let bashExecutor = new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve([stdout, stderr])
    })
  })
  return bashExecutor
}

export const bashWalker = async (commands, tag = '') => {
  console.log('START')
  let dir = await fs.ensureDir('./__export') || './__export'
  let filename = `${tag}_${Date.now()}.log`
  let filePath = path.join(dir, filename)
  console.log('Logs :', filePath)

  for (let i = 0; i < commands.length; i++) {
    let ret = await run(commands[i]).catch(err => console.log(` - !! ERROR !! ${commands[i]} ${err}`))
    let errInfo = `
==> Execute ${i}: ${commands[i]}
 - INFO: ${ret[0]}
 - WARNING: ${ret[1]}
    `
    console.log(errInfo)
    await fs.appendFile(filePath, errInfo)
  }
  console.log('DONE')
}
