import express, { Router, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import * as fs from 'fs'
import path from 'path'
import { BASE_PATH, getRequestUrl, isProductionEnvironment } from '../common'
import SharedConfig from '../libs/SharedConfig'
import compression from 'compression'
import { acquireLock, releaseLock } from '../utils/htaccessLock'
import * as http from 'http'
import * as https from 'https'

export const serverCertificateOptions = (): https.ServerOptions => {
  const caDir = path.resolve(BASE_PATH, 'ca')
  const certPath = path.resolve(caDir, 'certificate.crt')
  const caPath = path.resolve(caDir, 'ca_bundle.crt')
  const keyPath = path.resolve(caDir, 'private.key')

  const cert = fs.readFileSync(certPath)
  const ca = fs.readFileSync(caPath)
  const key = fs.readFileSync(keyPath)

  const options: https.ServerOptions = {
    cert,
    ca,
    key,
  }

  return options
}

export const production = isProductionEnvironment()
export const getProtocol = () => {
  let protocol = production ? 'https' : 'http'
  return protocol
}

export function getPort(server: http.Server | https.Server) {
  const address = server.address()
  const port = typeof address === 'string' ? address : address?.port
  return port!
}

export const ip = process.env.SERVER_IP || '127.0.0.1'

export default async function addMiddleware({
  router,
}: {
  router: Router
}) {
  dotenv.config()

  /* if (production) {
    //enforce https
    router.use((req, res, next) => {
      if (!req.secure) {
        const url = getRequestUrl(req).replace('http:', 'https:')
        return res.redirect(url)
      }
      next()
    })
  } */

  router.use(
    cors({
      methods: ['GET', 'POST', 'PATCH', 'DELETE'] /*origin: "http://localhost:3000"*/,
    }),
  )
  router.use(
    compression({
      // Compress only if the response size is at least 1KB
      threshold: 1024,

      // Set the compression level (0-9); 6 is a good balance
      level: 6,
    }),
  )

  router.use(express.json({ limit: '10mb' }))
  router.use(express.urlencoded({ extended: false }))
  router.use((req: Request, _res: Response, next: NextFunction) => {
    SharedConfig.set('requestUrl', getRequestUrl(req))
    next()
  })
}

export async function addHtAccessRuleProxy({ port }: { port: number | string }) {
  const REWRITE_RULE = path.resolve(BASE_PATH, '.htaccess-rewrite-rule')
  const HTACCESS = path.resolve(BASE_PATH, '.htaccess')
  try {
    await acquireLock()
    const rule = fs.readFileSync(REWRITE_RULE, 'utf8')
    const newRules: string[] = []

    if (!rule) {
      console.log('Error reading rewrite rule: ' + REWRITE_RULE, 'No Rule found')
    } else {
      const currentRule = `${rule}`
        .replace(/\[PROTOCOL\]/g, getProtocol())
        .replace(/\[PORT\]/g, `${port}`)
        .replace(/\[IP\]/g, `${ip}`)
      newRules.push(currentRule)

      let htaccess: string | undefined

      try {
        htaccess = fs.readFileSync(HTACCESS, 'utf8') || ''
      } catch (error) {
        console.log('Error reading htaccess rule: ' + HTACCESS, error)
        htaccess = ''
      }

      if (!htaccess) {
        htaccess = 'RewriteEngine On\nDirectorySlash On\nRewriteBase /\n'
      }

      let filteredHtaccess = htaccess.split('\n')

      // Remove existing rules for the current scheme and other schemes
      filteredHtaccess = filteredHtaccess.filter((currentRule) => {
        return !currentRule.includes(`^(.*)`)
      })

      filteredHtaccess.push(...newRules.reverse())
      const newHtaccess = filteredHtaccess.join('\n')

      try {
        fs.writeFileSync(HTACCESS, newHtaccess)
      } catch (error) {
        console.log('Error writing htaccess rule: ' + HTACCESS, error)
      }
    }
  } catch (error) {
    console.log('Error reading rewrite rule: ' + REWRITE_RULE, error)
  } finally {
    releaseLock()
  }
}

export function onClose(server: http.Server, listener = async () => {}) {
  server.on('close', async () => await listener())
}
