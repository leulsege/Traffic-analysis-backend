import { Request, Response, NextFunction } from 'express'
import VehicleAccidentModel from '../models/vehicleAccidentModel'
import multer from 'multer'
import sharp from 'sharp'
import asyncError from '../utils/asyncError'
import AppError from '../utils/appError'
import { DriverModel } from '../models/driverModel'

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

export const uploadAccidentPhoto = upload.single('photo')

export const resizeAccidentPhoto = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next()

    req.file.filename = `accident-${req.params.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/accidents/${req.file.filename}`)

    next()
  },
)

export const createVehicleAccident = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newVehicleAccident = await VehicleAccidentModel.create(req.body)
    const driver = await DriverModel.findByIdAndUpdate(req.body.driver, {
      haveAccident: true,
    })
    res.status(201).json({
      status: 'success',
      data: {
        vehicleAccident: newVehicleAccident,
      },
    })
  },
)

export const getAllVehicleAccidents = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const vehicleAccidents = await VehicleAccidentModel.find()

    res.status(200).json({
      status: 'success',
      results: vehicleAccidents.length,
      data: {
        vehicleAccidents,
      },
    })
  },
)

export const getVehicleAccident = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const vehicleAccident = await VehicleAccidentModel.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        vehicleAccident,
      },
    })
  },
)

export const updateVehicleAccident = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.file) req.body.photo = req.file.filename
    const updateVehicleAccident = await VehicleAccidentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      status: 'success',
      data: {
        vehicleAccident: updateVehicleAccident,
      },
    })
  },
)
export const deleteVehicleAccident = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteVehicleAccident = await VehicleAccidentModel.findByIdAndDelete(
      req.params.id,
    )

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)
