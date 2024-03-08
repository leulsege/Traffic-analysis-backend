import asyncError from '../utils/asyncError'
import TrainingModel from '../models/trainingModel'
import { Request, Response, NextFunction } from 'express'
import APIFeatures from '../utils/apiFeatures'
import { DriverModel } from '../models/driverModel'
import AppError from '../utils/appError'

export const createTraining = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.driver) {
      const driver = await DriverModel.findOne({
        licenseNumber: req.body.driver,
      })
      if (!driver)
        new AppError('there is no driver with this licenseNumber', 404)
      req.body.driver = (driver as any)?._id
    }
    const newTraining = await TrainingModel.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        training: newTraining,
      },
    })
  },
)

export const getAllTrainings = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const features = new APIFeatures(TrainingModel.find(), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort()

    const trainings = await features.query

    res.status(200).json({
      status: 'success',
      results: trainings.length,
      data: {
        trainings,
      },
    })
  },
)

export const getTraining = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const training = await TrainingModel.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        training,
      },
    })
  },
)

export const updateTraining = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.driver) {
      const driver = await DriverModel.findOne({
        licenseNumber: req.body.driver,
      })
      if (!driver)
        new AppError('there is no driver with this licenseNumber', 404)
      req.body.driver = (driver as any)?._id
    }

    const updateTraining = await TrainingModel.findByIdAndUpdate(
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
        training: updateTraining,
      },
    })
  },
)
export const deleteTraining = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleteTraining = await TrainingModel.findByIdAndUpdate(
      req.params.id,
      {
        activeTrainer: false,
      },
    )

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)

export const backTraining = asyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const backTraining = await TrainingModel.findByIdAndUpdate(req.params.id, {
      activeTrainer: true,
    })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)
