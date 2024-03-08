import multer from 'multer'
import sharp from 'sharp'
import asyncError from '../utils/asyncError'
import { User } from '../models/adminModel'

import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'

const multerStorage = multer.memoryStorage()

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(
      new AppError(
        'Not an image! Please upload only images.',
        400,
      ) as unknown as null,
      false,
    )
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

export const uploadUserPhoto = upload.single('photo')

export const getMe = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    req.params.id = (req as any).user._id
    next()
  },
)

export const resizeUserPhoto = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next()
    req.file.filename = `admin-${(req as any).user._id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/admins/${req.file.filename}`)

    next()
  },
)
export const getAllUsers = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await User.find()

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  },
)

export const getUser = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  },
)

export const updateUser = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400,
        ),
      )
    }

    if (req.file) req.body.photo = req.file.filename
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        user: updateUser,
      },
    })
  },
)
export const deleteUser = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteUser = await User.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)
