import fs from 'fs'
import path from 'path'
import { BASE_PATH } from '../common'

const LOCK_FILE = path.resolve(BASE_PATH, '.htaccess.lock')
const LOCK_RETRY_INTERVAL_MS = 1000

export async function acquireLock(): Promise<void> {
  while (true) {
    try {
      fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: 'wx' }) // 'wx' fails if file exists
      console.log(`[${process.pid}] Lock acquired.`)
      return // Lock acquired
    } catch (err: any) {
      if (err.code !== 'EEXIST') throw err
      console.log(`[${process.pid}] Waiting for lock...`)
      await new Promise((res) => setTimeout(res, LOCK_RETRY_INTERVAL_MS))
    }
  }
}

export function releaseLock(): void {
  try {
    fs.unlinkSync(LOCK_FILE)
    console.log(`[${process.pid}] Lock released.`)
  } catch (err) {
    console.error(`[${process.pid}] Failed to release lock:`, err)
  }
}
