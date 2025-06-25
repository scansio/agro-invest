import multer from 'multer'
import path from 'path'
import { rand } from './md5'
import fs from 'fs'
import IUser from '../endpoints/user/IUser'
import BaseController from './controller/BaseController'
import { BASE_PATH } from '../common'

class FileStore {
  private storage
  private upload: multer.Multer
  private privateDir
  private privateDirName
  private publicDir
  private publicDirName
  private activeDir
  private activeDirName

  constructor(
    private controller: BaseController,
    private isPublic = true,
    private allowedFileTypes = ['image/jpeg', 'image/png'],
    private allowedSizeInMB = 5,
    user?: IUser['_id'],
  ) {
    this.privateDirName = `/file_store/private/user/${user ? user : this.controller.user._id}`
    this.publicDirName = `/cdn/file_store/${this.controller?.user?._id || 'anonymous'}`
    this.privateDir = path.resolve(`${BASE_PATH}${this.privateDirName}`)
    this.publicDir = path.resolve(`${BASE_PATH}${this.publicDirName}`)
    fs.mkdirSync(this.privateDir, { recursive: true })
    fs.mkdirSync(this.publicDir, { recursive: true })
    this.activeDir = this.isPublic ? this.publicDir : this.privateDir
    this.activeDirName = `${this.isPublic ? this.publicDirName : this.privateDirName}/`
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.activeDir)
      },
      filename: (req, file, cb) => {
        cb(null, `${rand(12345, 678910)}.${file.mimetype.split('/')[1]}`)
      },
    })
    this.upload = multer({
      storage: this.storage,
      limits: {
        fieldSize: 2 * 1024 * 1024, // Set max size for non-file fields (e.g., text fields)
        fileSize: this.allowedSizeInMB * 1024 * 1024, // Set max size for uploaded files (e.g., images)
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedFileTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error(`Invalid file type. (${this.allowedFileTypes?.join(', ')} only)`))
        }
      },
    })
  }

  public async uploadFor(
    ...filenames: string[]
  ): Promise<undefined | { [key: string]: string | string[] | undefined }> {
    const uploadedPathOrError = await new Promise((resolve) => {
      this.upload.fields(filenames.map((name) => ({ name })))(this.controller.req, this.controller.res, (error) => {
        if (error) return resolve(error)

        const files = this.controller.req.files as { [key: string]: Express.Multer.File[] }
        if (!files) return resolve(undefined)

        Object.entries(files).forEach(([key, _files]) => {
          if (!_files || _files.length < 1) {
            files[key] = undefined as any
          } else if (_files.length > 1) {
            files[key] = _files.map((_file) => this.activeDirName + _file.filename) as any
          } else {
            files[key] = (this.activeDirName + _files[0].filename) as any
          }
        })

        resolve(files)
      })
    })

    if (uploadedPathOrError instanceof Error) {
      throw new Error((uploadedPathOrError as any)?.message)
    }

    return uploadedPathOrError as any
  }

  public async uploadForMultiple(filename: string, maxCount: number = 10): Promise<undefined | string[]> {
    const uploadedPathOrError = await new Promise((resolve) => {
      this.upload.array(filename, maxCount)(
        // Use array for multiple files
        this.controller.req,
        this.controller.res,
        (error) => {
          if (error) {
            return resolve(error)
          }
          const files = this.controller.req.files
          if (!files || files.length === 0) {
            return resolve(undefined)
          } else {
            const filenames = (files as Express.Multer.File[]).map(
              (file: Express.Multer.File) => this.activeDirName + file.filename,
            )
            return resolve(filenames)
          }
        },
      )
    })

    if (uploadedPathOrError instanceof Error) {
      throw new Error((uploadedPathOrError as any)?.message)
    }

    return uploadedPathOrError as any
  }

  delete(filename?: string) {
    if (!filename) return

    const f = path.resolve(this.activeDir, filename?.split('/').pop() || '')
    try {
      fs.rmSync(f)
    } catch (error) {
      console.error(error)
    }
  }
}

export default FileStore
