import multer from 'multer'
import sharp from 'sharp'
import asyncError from '../utils/asyncError'
import { DriverModel } from '../models/driverModel'
import { Request, Response, NextFunction } from 'express'
import APIFeatures from '../utils/apiFeatures'
import AppError from '../utils/appError'
import VehicleModel from '../models/vehicleModel'
import VehicleAccidentModel from '../models/vehicleAccidentModel'
import TrainingModal from '../models/trainingModel'

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

export const resizeUserPhoto = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next()

    req.file.filename = `driver-${req.params.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/drivers/${req.file.filename}`)

    next()
  },
)

export const createDriver = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.vehicle) {
      const vehicle = await VehicleModel.findOne({
        plateNumber: req.body.vehicle,
      })
      if (!vehicle)
        new AppError('there is no vehicle with this PlateNumber', 404)
      req.body.vehicle = (vehicle as any)?._id
    }
    const newDriver = await DriverModel.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        driver: newDriver,
      },
    })
  },
)

export const getAllDrivers = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const features = new APIFeatures(DriverModel.find(), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort()

    const drivers = await features.query

    res.status(200).json({
      status: 'success',
      results: drivers.length,
      data: {
        drivers,
      },
    })
  },
)

export const getDriver = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const driver = await DriverModel.findById(req.params.id).populate({
      path: 'accidentRecord',
      select: '-driver -__v',
    })

    // Sort the filtered array by the 'createdBy' field
    driver.accidentRecord?.sort(
      (b, a) => a.createdAt.getTime() - b.createdAt.getTime(),
    )

    // Await currentPoint calculation
    const currentPoint = await (driver as any).currentPoint

    res.status(200).json({
      status: 'success',
      data: {
        driver: {
          ...driver.toJSON(),
          currentPoint,
        },
      },
    })
  },
)
export const updateDriver = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.file) req.body.photo = req.file.filename
    if (req.body.vehicle) {
      const vehicle = await VehicleModel.findOne({
        plateNumber: req.body.vehicle,
      })
      if (!vehicle)
        new AppError('there is no vehicle with this PlateNumber', 404)
      req.body.vehicle = (vehicle as any)?._id
    }
    const updateDriver = await DriverModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate({
      path: 'accidentRecord',
      select: '-driver -__v',
    })

    updateDriver.accidentRecord.sort(
      (b, a) => a.createdAt.getTime() - b.createdAt.getTime(),
    )

    const currentPoint = await (updateDriver as any).currentPoint

    res.status(200).json({
      status: 'success',
      data: {
        driver: {
          ...updateDriver.toJSON(),
          currentPoint,
        },
      },
    })
  },
)
export const deleteDriver = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteDriver = await DriverModel.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
        terminationDate: new Date(),
      },
      { new: true, runValidators: true },
    )

    const deleteTraining = await TrainingModal.findOneAndUpdate(
      {
        driver: req.params.id,
      },
      {
        activeTrainer: false,
      },
      { new: true, runValidators: true },
    )

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)

export const backDriver = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const backDriver = await DriverModel.findByIdAndUpdate(
      req.params.id,
      {
        active: true,
        terminationDate: null,
        commencementDate: new Date(),
      },
      { new: true, runValidators: true },
    )

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)

export const accidentFreeDrivers = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const driver = await DriverModel.find({
      haveAccident: false,
    })

    res.status(200).json({
      status: 'success',
      data: {
        driver,
      },
    })
  },
)

export const clearAccident = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updateDriver = await DriverModel.findByIdAndUpdate(
      req.params.id,
      { haveAccident: false },
      {
        new: true,
        runValidators: true,
      },
    )

    const clearAccidents = await VehicleAccidentModel.deleteMany({
      driver: req.params.id,
    })

    res.status(200).json({
      status: 'success',
      data: {
        updateDriver,
      },
    })
  },
)
