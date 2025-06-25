import fs from 'fs'
import path from 'path'
import { BASE_PATH } from '../common'

const IPC = path.resolve(BASE_PATH, 'server-terminator-ipc')

export const startServerTerminatorListener = (server: string, cb: () => void) => {
  fs.watchFile(IPC, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      fs.readFile(IPC, 'utf8', (err, serverName) => {
        if (err) {
          console.log('Error reading IPC: ' + IPC, err)
        } else {
          serverName = `${serverName}`.trim()
          if (serverName && (serverName === server || serverName === 'All')) {
            cb()
          }
        }
      })
    }
  })
}

export const serverTerminatorEvent = (server?: string) => fs.writeFileSync(IPC, `${server || 'All'}`)
