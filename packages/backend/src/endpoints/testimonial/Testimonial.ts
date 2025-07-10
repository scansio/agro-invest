/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { getDefinedValuesFrom } from '../../common'
import { NOT_FOUND, GET_SUCCESS, BAD_REQUEST, POST_SUCCESS } from '../../configs/statusCodeConstants'
import BaseController from '../../libs/controller/BaseController'
import FileStore from '../../libs/FileStore'
import PaginatingModel from '../../libs/models/PaginatingModel'
import IUser from '../user/IUser'
import { ITestimonial } from './ITestimonial'
import TestimonialModel from './TestimonialModel'

class Testimonial extends BaseController {
  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    return true
  }

  async get({ _id }: any) {
    const found = await TestimonialModel.findByPk(`${_id}`)
    if (!found) this.status(false).statusCode(NOT_FOUND).message('Testimonial not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(found).send()
  }

  async all() {
    const testimonials = await new PaginatingModel<ITestimonial>(TestimonialModel, this).markPublic(true).exec()
    if (!testimonials) this.status(false).statusCode(NOT_FOUND).message('No Testimonials').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(testimonials).send()
  }

  async create() {
    let personAvatar: string | undefined
    let filestore = new FileStore(this, true, ['image/jpeg', 'image/png'], 5)
    if (this.req.headers['content-type']?.includes('multipart')) {
      const temp = (await filestore.uploadFor('personAvatar')) || null
      personAvatar = temp?.personAvatar as string
    }
    const { content, personName, occupationOrPosition } = this.req.body as ITestimonial

    const created = await TestimonialModel.create({
      content,
      personName,
      occupationOrPosition,
      personAvatar,
    })
    if (!created) {
      personAvatar && filestore.delete(personAvatar)
      this.status(false).statusCode(BAD_REQUEST).message('Error creating Testimonial').send()
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Testimonial created').setData(created).send()
    }
  }

  async update() {
    let personAvatar
    let filestore = new FileStore(this, true, ['image/jpeg', 'image/png'], 5)
    if (this.req.headers['content-type']?.includes('multipart')) {
      const temp = (await filestore.uploadFor('personAvatar')) || null
      personAvatar = temp?.personAvatar as string
    }

    const { _id, content, personName, occupationOrPosition, status } = this.req.body as ITestimonial

    const definedValues = getDefinedValuesFrom({
      content,
      personName,
      occupationOrPosition,
      personAvatar,
      status,
    })
    const prev = (await TestimonialModel.findByPk(_id))

    const [updatedCount, updatedRows] = await TestimonialModel.update(definedValues, {
      where: { _id },
      returning: true,
    })

    if (updatedCount > 0 && personAvatar && prev?.personAvatar) {
      filestore.delete(prev?.personAvatar)
    }

    if (updatedCount === 0) {
      filestore.delete(personAvatar)
      this.status(false).statusCode(BAD_REQUEST).message('Testimonial failed to update due to error').send()
    } else {
      this.status(true).statusCode(POST_SUCCESS).message('Testimonial updated').setData(updatedRows[0]).send()
    }
  }

  async delete({ _id }: any) {
    const deleted = (await TestimonialModel.findOne({ where: { _id } }))
    if (!deleted) {
      this.status(false).statusCode(BAD_REQUEST).message('Testimonial failed to be deleted due to error').send()
    } else {
      let filestore = new FileStore(this, true, ['image/jpeg', 'image/png'], 5)
      filestore.delete(deleted.personAvatar)
      await TestimonialModel.destroy({ where: { _id } })
      this.status(true).statusCode(POST_SUCCESS).message('Testimonial deleted').setData(deleted).send()
    }
  }
}

export default Testimonial
